import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { digitalInvitationService } from "@/features/digital-invitations/services/digitalInvitationService";
import { SakeenaTemplate } from "@/features/digital-invitations/templates/sakeenah/SakeenaTemplate";
import { ClassicTemplate } from "@/features/digital-invitations/templates/classic/ClassicTemplate";

const PublicInvitationPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: invitation, isLoading, error } = useQuery({
    queryKey: ["public-invitation", slug],
    queryFn: () => digitalInvitationService.getPublicInvitation(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Undangan Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-4">
            Maaf, undangan yang Anda cari tidak tersedia atau sudah tidak aktif.
          </p>
          <a
            href="/"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  // Check if invitation is expired
  const isExpired = new Date(invitation.expires_at) < new Date();
  if (isExpired) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Undangan Sudah Berakhir
          </h1>
          <p className="text-gray-600 mb-4">
            Masa aktif undangan ini telah berakhir pada{" "}
            {new Date(invitation.expires_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    );
  }

  // Extract first names for nicknames (if not provided in data)
  const brideNickname = invitation.data.bride_name?.split(" ")[0] || "";
  const groomNickname = invitation.data.groom_name?.split(" ")[0] || "";

  // Render appropriate template based on template slug
  const renderTemplate = () => {
    const templateSlug = invitation.template?.slug || "sakeenah";

    switch (templateSlug) {
      case "sakeenah":
        return (
          <SakeenaTemplate
            brideNickname={brideNickname}
            groomNickname={groomNickname}
            brideName={invitation.data.bride_name || ""}
            groomName={invitation.data.groom_name || ""}
            eventDate={invitation.data.event_date || ""}
            eventTime={invitation.data.event_time}
            venueName={invitation.data.venue_name || ""}
            venueAddress={invitation.data.venue_address}
            venueMapUrl={invitation.data.venue_map_url}
            additionalInfo={invitation.data.additional_info}
            photos={invitation.data.photo_paths || []}
          />
        );
      case "classic":
        return (
          <ClassicTemplate
            brideNickname={brideNickname}
            groomNickname={groomNickname}
            brideName={invitation.data.bride_name || ""}
            groomName={invitation.data.groom_name || ""}
            eventDate={invitation.data.event_date || ""}
            eventTime={invitation.data.event_time}
            venueName={invitation.data.venue_name || ""}
            venueAddress={invitation.data.venue_address}
            venueMapUrl={invitation.data.venue_map_url}
            additionalInfo={invitation.data.additional_info}
            photos={invitation.data.photo_paths || []}
          />
        );
      default:
        return (
          <SakeenaTemplate
            brideNickname={brideNickname}
            groomNickname={groomNickname}
            brideName={invitation.data.bride_name || ""}
            groomName={invitation.data.groom_name || ""}
            eventDate={invitation.data.event_date || ""}
            eventTime={invitation.data.event_time}
            venueName={invitation.data.venue_name || ""}
            venueAddress={invitation.data.venue_address}
            venueMapUrl={invitation.data.venue_map_url}
            additionalInfo={invitation.data.additional_info}
            photos={invitation.data.photo_paths || []}
          />
        );
    }
  };

  return <div>{renderTemplate()}</div>;
};

export default PublicInvitationPage;
