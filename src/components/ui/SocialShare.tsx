import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  PinterestIcon,
} from "react-share";
import { Instagram, Link2, Check } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { useState } from "react";
import { toast } from "@/hooks/ui/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  media: string;
  description?: string;
  showLabel?: boolean;
  iconSize?: number;
}

export const SocialShare = ({ 
  url, 
  title, 
  media, 
  description = "",
  showLabel = true,
  iconSize = 32
}: SocialShareProps) => {
  const [copied, setCopied] = useState(false);
  const instagramUrl = "https://www.instagram.com/duainsan.story/";
  
  // TikTok share - opens TikTok with pre-filled text
  const handleTikTokShare = () => {
    const text = encodeURIComponent(`${title} - ${url} #duainsanstory`);
    // TikTok doesn't have a direct web share URL, so we open TikTok app or web
    window.open(`https://www.tiktok.com/upload?caption=${text}`, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link tersalin!",
        description: "Link telah disalin ke clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Gagal menyalin link",
        description: "Silakan coba lagi",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {showLabel && <span className="text-sm font-medium">Share:</span>}
      
      {/* Facebook */}
      <FacebookShareButton url={url} hashtag="#duainsanstory">
        <FacebookIcon size={iconSize} round />
      </FacebookShareButton>

      {/* Twitter/X */}
      <TwitterShareButton url={url} title={title} hashtags={["duainsanstory"]}>
        <TwitterIcon size={iconSize} round />
      </TwitterShareButton>

      {/* WhatsApp */}
      <WhatsappShareButton url={url} title={title} separator=" - ">
        <WhatsappIcon size={iconSize} round />
      </WhatsappShareButton>

      {/* Pinterest */}
      <PinterestShareButton url={url} media={media} description={title}>
        <PinterestIcon size={iconSize} round />
      </PinterestShareButton>

      {/* TikTok */}
      <button
        onClick={handleTikTokShare}
        className="inline-flex items-center justify-center rounded-full bg-black hover:bg-black/90 transition-colors"
        style={{ width: iconSize, height: iconSize }}
        title="Share on TikTok"
      >
        <SiTiktok className="text-white" style={{ width: iconSize * 0.5, height: iconSize * 0.5 }} />
      </button>

      {/* Instagram - Link to profile */}
      <a 
        href={instagramUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block"
        title="Follow us on Instagram"
      >
        <div 
          className="flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white"
          style={{ width: iconSize, height: iconSize }}
        >
          <Instagram className="w-1/2 h-1/2" />
        </div>
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
        style={{ width: iconSize, height: iconSize }}
        title="Copy link"
      >
        {copied ? (
          <Check className="w-1/2 h-1/2 text-green-600" />
        ) : (
          <Link2 className="w-1/2 h-1/2" />
        )}
      </button>
    </div>
  );
};
