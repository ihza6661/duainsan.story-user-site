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
    queryFn: () => digitalInvitationService.viewPublicInvitation(slug!),
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

  // Extract first names for nicknames
  const brideNickname = invitation.customization.bride_name?.split(" ")[0] || "";
  const groomNickname = invitation.customization.groom_name?.split(" ")[0] || "";

  // Render appropriate template based on template name
  const renderTemplate = () => {
    const templateName = invitation.template?.name || "";
    const customization = invitation.customization;
    
    // Parse photo_paths if it's a JSON string
    let photos: string[] = [];
    if (customization.photo_paths) {
      photos = typeof customization.photo_paths === 'string' 
        ? JSON.parse(customization.photo_paths) 
        : customization.photo_paths;
    }

    // Check which template based on name
    const isSakeenah = templateName.toLowerCase().includes('sakeenah');
    
    if (isSakeenah) {
      return (
        <SakeenaTemplate
          brideNickname={brideNickname}
          groomNickname={groomNickname}
          brideName={customization.bride_name || ""}
          groomName={customization.groom_name || ""}
          eventDate={customization.event_date || ""}
          eventTime={customization.event_time || ""}
          venueName={customization.venue_name || ""}
          venueAddress={customization.venue_address || ""}
          venueMapUrl={customization.venue_map_url || ""}
          additionalInfo={customization.additional_info || ""}
          photos={photos}
        />
      );
    } else {
      // Default to Classic template
      return (
        <ClassicTemplate
          brideNickname={brideNickname}
          groomNickname={groomNickname}
          brideName={customization.bride_name || ""}
          groomName={customization.groom_name || ""}
          eventDate={customization.event_date || ""}
          eventTime={customization.event_time || ""}
          venueName={customization.venue_name || ""}
          venueAddress={customization.venue_address || ""}
          venueMapUrl={customization.venue_map_url || ""}
          additionalInfo={customization.additional_info || ""}
          photos={photos}
        />
      );
    }
  };

  return <div>{renderTemplate()}</div>;
};

export default PublicInvitationPage;
