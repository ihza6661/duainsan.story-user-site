#!/bin/bash

# Cloudflare CDN Verification Script
# Tests if Cloudflare is properly configured and working

echo "🔍 Cloudflare CDN Verification Script"
echo "======================================"
echo ""

# Check if domain is provided
DOMAIN=${1:-"duainsan.story"}

echo "Testing domain: $DOMAIN"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test and display result
test_feature() {
    local test_name=$1
    local test_command=$2
    local expected=$3
    
    echo -n "Testing: $test_name ... "
    
    result=$(eval "$test_command" 2>&1)
    
    if echo "$result" | grep -q "$expected"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "  Expected: $expected"
        echo "  Got: $result"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. DNS & Cloudflare Detection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Check if domain resolves
echo -n "1.1 Domain Resolution ... "
if host $DOMAIN > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "  Domain does not resolve"
    FAILED=$((FAILED + 1))
fi

# Test 2: Check for Cloudflare nameservers
echo -n "1.2 Cloudflare Nameservers ... "
NS_RESULT=$(dig $DOMAIN NS +short | grep -i cloudflare)
if [ -n "$NS_RESULT" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    echo "  Nameservers: $NS_RESULT"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "  Not using Cloudflare nameservers (may still work if CNAME setup)"
fi

# Test 3: Check for Cloudflare IPs
echo -n "1.3 Cloudflare IP Range ... "
IP=$(dig $DOMAIN +short | head -1)
if [ -n "$IP" ]; then
    # Cloudflare IP ranges (simplified check)
    if echo "$IP" | grep -qE '^(104\.|172\.|173\.|188\.|190\.|197\.|198\.)'; then
        echo -e "${GREEN}✓ PASSED${NC}"
        echo "  IP: $IP (Cloudflare range)"
        PASSED=$((PASSED + 1))
    else
        echo -e "${YELLOW}⚠ WARNING${NC}"
        echo "  IP: $IP (may not be Cloudflare)"
    fi
else
    echo -e "${RED}✗ FAILED${NC}"
    FAILED=$((FAILED + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. HTTP Headers & CDN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 4: Check for CF-Ray header
test_feature "2.1 CF-Ray Header" \
    "curl -sI https://$DOMAIN | grep -i cf-ray" \
    "cf-ray"

# Test 5: Check for Cloudflare server header
test_feature "2.2 Server Header" \
    "curl -sI https://$DOMAIN | grep -i server" \
    "cloudflare"

# Test 6: Check cache status
echo -n "2.3 Cache Status ... "
CACHE_STATUS=$(curl -sI https://$DOMAIN | grep -i cf-cache-status | awk '{print $2}' | tr -d '\r')
if [ -n "$CACHE_STATUS" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    echo "  Cache Status: $CACHE_STATUS"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "  No cache status header (dynamic content or first request)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. SSL/TLS Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 7: Check SSL certificate
echo -n "3.1 SSL Certificate ... "
SSL_INFO=$(echo | openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>/dev/null | openssl x509 -noout -issuer 2>/dev/null)
if echo "$SSL_INFO" | grep -qi "cloudflare"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    echo "  Issuer: Cloudflare"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "  Not using Cloudflare SSL (may be origin certificate)"
fi

# Test 8: Check HTTPS redirect
echo -n "3.2 HTTPS Redirect ... "
HTTP_REDIRECT=$(curl -sI http://$DOMAIN | grep -i location | grep https)
if [ -n "$HTTP_REDIRECT" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "  HTTP not redirecting to HTTPS"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Image Caching & Optimization"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 9: Check image caching (first request)
echo -n "4.1 Image Cache (First Request) ... "
IMAGE_URL="https://$DOMAIN/products/alice-wonderland-theme/1.jpg"
FIRST_CACHE=$(curl -sI "$IMAGE_URL" | grep -i cf-cache-status | awk '{print $2}' | tr -d '\r')
if [ -n "$FIRST_CACHE" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    echo "  Status: $FIRST_CACHE (expected: MISS or EXPIRED)"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "  No cache status for images"
fi

# Test 10: Check image caching (second request)
echo -n "4.2 Image Cache (Second Request) ... "
sleep 1
SECOND_CACHE=$(curl -sI "$IMAGE_URL" | grep -i cf-cache-status | awk '{print $2}' | tr -d '\r')
if [ "$SECOND_CACHE" = "HIT" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    echo "  Status: $SECOND_CACHE (cached successfully!)"
    PASSED=$((PASSED + 1))
elif [ "$SECOND_CACHE" = "DYNAMIC" ]; then
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "  Status: $SECOND_CACHE (not cached - check cache rules)"
else
    echo -e "${YELLOW}⚠ INFO${NC}"
    echo "  Status: $SECOND_CACHE"
fi

# Test 11: Check WebP availability
echo -n "4.3 WebP Images Available ... "
WEBP_URL="https://$DOMAIN/products/alice-wonderland-theme/1.webp"
WEBP_STATUS=$(curl -sI "$WEBP_URL" | head -1 | awk '{print $2}')
if [ "$WEBP_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    echo "  WebP images available"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "  WebP images not found (HTTP $WEBP_STATUS)"
    FAILED=$((FAILED + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Security Headers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 12: Security headers
test_feature "5.1 X-Content-Type-Options" \
    "curl -sI https://$DOMAIN | grep -i x-content-type-options" \
    "nosniff"

test_feature "5.2 X-Frame-Options" \
    "curl -sI https://$DOMAIN | grep -i x-frame-options" \
    "SAMEORIGIN"

test_feature "5.3 X-XSS-Protection" \
    "curl -sI https://$DOMAIN | grep -i x-xss-protection" \
    "1"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Performance Metrics"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 13: Response time
echo -n "6.1 Response Time ... "
RESPONSE_TIME=$(curl -sI https://$DOMAIN -w "%{time_total}" -o /dev/null)
if (( $(echo "$RESPONSE_TIME < 1.0" | bc -l) )); then
    echo -e "${GREEN}✓ EXCELLENT${NC}"
    echo "  Response Time: ${RESPONSE_TIME}s"
    PASSED=$((PASSED + 1))
elif (( $(echo "$RESPONSE_TIME < 3.0" | bc -l) )); then
    echo -e "${YELLOW}⚠ GOOD${NC}"
    echo "  Response Time: ${RESPONSE_TIME}s"
else
    echo -e "${RED}✗ SLOW${NC}"
    echo "  Response Time: ${RESPONSE_TIME}s"
    FAILED=$((FAILED + 1))
fi

# Test 14: Compression
echo -n "6.2 Compression (Gzip/Brotli) ... "
COMPRESSION=$(curl -sI https://$DOMAIN -H "Accept-Encoding: gzip, br" | grep -i content-encoding)
if echo "$COMPRESSION" | grep -qi "br"; then
    echo -e "${GREEN}✓ EXCELLENT${NC}"
    echo "  Using: Brotli"
    PASSED=$((PASSED + 1))
elif echo "$COMPRESSION" | grep -qi "gzip"; then
    echo -e "${GREEN}✓ GOOD${NC}"
    echo "  Using: Gzip"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "  No compression detected"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL=$((PASSED + FAILED))
PASS_RATE=$(awk "BEGIN {printf \"%.1f\", ($PASSED/$TOTAL)*100}")

echo "Total Tests: $TOTAL"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo "Pass Rate: $PASS_RATE%"
echo ""

if [ $PASS_RATE -ge 90 ]; then
    echo -e "${GREEN}✅ Excellent! Cloudflare is properly configured.${NC}"
elif [ $PASS_RATE -ge 70 ]; then
    echo -e "${YELLOW}⚠️ Good, but some optimizations recommended.${NC}"
else
    echo -e "${RED}❌ Issues detected. Please review failed tests.${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔗 Useful Links"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Cloudflare Dashboard: https://dash.cloudflare.com"
echo "Analytics: https://dash.cloudflare.com/[account]/[zone]/analytics"
echo "PageSpeed Insights: https://pagespeed.web.dev/analysis?url=https://$DOMAIN"
echo "WebPageTest: https://www.webpagetest.org/?url=https://$DOMAIN"
echo ""

exit $([ $FAILED -eq 0 ] && echo 0 || echo 1)
