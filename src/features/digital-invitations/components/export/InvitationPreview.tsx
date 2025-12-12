import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { digitalInvitationService } from "../../services/digitalInvitationService";
import { getTemplateComponent } from "../../templates";

interface InvitationPreviewProps {
  invitationId: number;
  className?: string;
}

/**
 * Invitation preview component for export
 * Renders the invitation template with live data for image capture
 */
export const InvitationPreview = ({
  invitationId,
  className = "",
}: InvitationPreviewProps) => {
  const { data: invitation, isLoading, error } = useQuery({
    queryKey: ["invitation-preview", invitationId],
    queryFn: () => digitalInvitationService.getInvitationById(invitationId),
    enabled: !!invitationId,
  });

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-gray-600">Memuat preview...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Gagal memuat preview</p>
        </div>
      </div>
    );
  }

  // Get customization data
  const customization = invitation.customization_data || {};
  const customFields = customization.custom_fields || {};
  const photos = customization.photo_urls || [];

  // Get the template component
  const templateComponentName = invitation.template?.name || "";
  const TemplateComponent = templateComponentName
    ? getTemplateComponent(templateComponentName)
    : undefined;

  if (!TemplateComponent) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Template tidak ditemukan</p>
          <p className="text-xs text-gray-500 mt-1">{templateComponentName}</p>
        </div>
      </div>
    );
  }

  // Prepare template props from custom fields
  const templateProps = {
    // Sakeenah template fields (adjust based on your template)
    brideFullName: customFields.bride_full_name || "",
    brideNickname: customFields.bride_nickname || "",
    brideParents: customFields.bride_parents || "",
    groomFullName: customFields.groom_full_name || "",
    groomNickname: customFields.groom_nickname || "",
    groomParents: customFields.groom_parents || "",
    akadDate: customFields.akad_date || "",
    akadTime: customFields.akad_time || "",
    akadLocation: customFields.akad_location || "",
    receptionDate: customFields.reception_date || "",
    receptionTime: customFields.reception_time || "",
    receptionLocation: customFields.reception_location || "",
    venueAddress: customFields.venue_address || "",
    venueMapsUrl: customFields.venue_maps_url || "",
    couplePhoto: photos[0] || "",
    galleryPhotos: photos.slice(1) || [],
    instagramBride: customFields.instagram_bride || "",
    instagramGroom: customFields.instagram_groom || "",
    loveStory: customFields.love_story || "",
    
    // General fields
    openingMessage: customFields.opening_message || "",
    closingMessage: customFields.closing_message || "",
    
    // All custom fields as fallback
    ...customFields,
  };

  return (
    <div
      id="invitation-preview"
      className={`bg-white ${className}`}
      style={{
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <TemplateComponent {...templateProps} />
    </div>
  );
};
