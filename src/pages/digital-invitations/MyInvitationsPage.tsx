import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Edit, Share2, Calendar, MapPin, ExternalLink } from "lucide-react";
import { digitalInvitationService } from "@/features/digital-invitations/services/digitalInvitationService";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const MyInvitationsPage = () => {
  const { data: invitations, isLoading } = useQuery({
    queryKey: ["my-invitations"],
    queryFn: digitalInvitationService.getMyInvitations,
  });

  const getStatusBadge = (status: string, isExpired: boolean) => {
    if (isExpired) {
      return <Badge variant="destructive">Kadaluarsa</Badge>;
    }
    
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: idLocale });
    } catch {
      return dateString;
    }
  };

  const handleShare = async (publicUrl: string, coupleName: string) => {
    const fullUrl = `${window.location.origin}${publicUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Undangan Pernikahan ${coupleName}`,
          text: `Anda diundang ke pernikahan ${coupleName}`,
          url: fullUrl,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(fullUrl);
      // Show toast notification
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Undangan Digital Saya</h1>
        <p className="text-muted-foreground">
          Kelola undangan digital Anda
        </p>
      </div>

      {/* Invitations Grid */}
      {invitations && invitations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">
                      {invitation.template.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Order: {invitation.order.order_number}
                    </CardDescription>
                  </div>
                  {getStatusBadge(invitation.status, invitation.is_expired)}
                </div>
              </CardHeader>

              <CardContent>
                {invitation.customization_data ? (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">
                        {invitation.customization_data.bride_name || "Mempelai Wanita"}
                      </span>
                      <span>&</span>
                      <span className="font-medium">
                        {invitation.customization_data.groom_name || "Mempelai Pria"}
                      </span>
                    </div>

                    {invitation.customization_data.event_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(invitation.customization_data.event_date)}
                      </div>
                    )}

                    {invitation.customization_data.venue_name && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {invitation.customization_data.venue_name}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground mb-4">
                    Belum dikustomisasi
                  </div>
                )}

                {invitation.status === "active" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{invitation.view_count} views</span>
                    {invitation.expires_at && (
                      <span>
                        • Berlaku hingga {formatDate(invitation.expires_at)}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="gap-2 flex-col sm:flex-row">
                <Link to={`/my-invitations/${invitation.id}/edit`} className="flex-1 w-full">
                  <Button variant="outline" className="w-full" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>

                {invitation.status === "active" && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 w-full"
                      onClick={() =>
                        handleShare(
                          invitation.public_url,
                          `${invitation.customization_data?.bride_name || ""} & ${invitation.customization_data?.groom_name || ""}`
                        )
                      }
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Link
                      to={invitation.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-4xl mb-4">💌</div>
            <h3 className="text-lg font-semibold mb-2">
              Belum Ada Undangan Digital
            </h3>
            <p className="text-muted-foreground mb-6">
              Beli template undangan digital untuk memulai
            </p>
            <Link to="/digital-templates">
              <Button>
                Lihat Template
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyInvitationsPage;
