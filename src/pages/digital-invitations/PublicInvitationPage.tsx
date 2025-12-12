import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { digitalInvitationService } from "@/features/digital-invitations/services/digitalInvitationService";
import { getTemplateComponent } from "@/features/digital-invitations/templates";
import { MetaTags } from "@/components/seo/MetaTags";
import { InvitationShareButton } from "@/components/social/InvitationShareButton";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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

  // Get customization data
  const customization = invitation.customization;
  const customFields = customization.customization_json?.custom_fields || {};
  const photoData = customization.photo_urls || customization.photo_paths || [];
  
  // Extract photos - handle both old format (array of strings) and new format (array of objects)
  const photos = photoData.map((item: any) => {
    if (typeof item === 'string') return item;
    return item.url || item;
  });
  
  // Extract bride and groom photos by type
  const bridePhoto = photoData.find((item: any) => item.type === 'bride')?.url || photos[0] || '';
  const groomPhoto = photoData.find((item: any) => item.type === 'groom')?.url || photos[1] || '';
  
  const colorTheme = invitation.colorTheme || null;

  // Get the template component from the registry using template_component from backend
  const templateComponentName = invitation.template?.template_component;
  const TemplateComponent = templateComponentName 
    ? getTemplateComponent(templateComponentName)
    : undefined;

  // If template not found in registry, show error
  if (!TemplateComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Template Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-4">
            Maaf, template untuk undangan ini tidak tersedia. Silakan hubungi administrator.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Template: {templateComponentName || 'Unknown'}
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

  // Prepare props for the template component - map dynamic custom_fields to template props
  // This mapping should match the field_keys from the template_fields table
  const templateProps = {
    // Sakeenah template fields
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
    gmapsLink: customFields.gmaps_link || "",
    preweddingPhoto: customFields.prewedding_photo || "",
    primaryColor: customFields.primary_color || "#2C5F2D",
    
    // Classic template fields (for backward compatibility)
    couplePhoto: customFields.couple_photo || "",
    eventDate: customFields.event_date || "",
    eventTime: customFields.event_time || "",
    eventLocation: customFields.event_location || "",
    themeColor: customFields.theme_color || "#1a1a1a",
    
    // Common/legacy fields for backward compatibility
    // Priority: bride_name/groom_name > bride_full_name/groom_full_name
    brideName: customFields.bride_name || customFields.bride_full_name || customization.bride_name || "",
    groomName: customFields.groom_name || customFields.groom_full_name || customization.groom_name || "",
    
    // Location fields - prioritize event_location (actual venue) over venue_address
    venueName: customFields.venue_name || customFields.akad_location || customization.venue_name || "",
    venueAddress: customFields.event_location || customFields.venue_address || customFields.reception_location || customization.venue_address || "",
    venueMapUrl: customFields.gmaps_link || customFields.venue_maps_url || customization.venue_maps_url || "",
    
    additionalInfo: customFields.additional_info || customization.additional_info || "",
    photos: [bridePhoto, groomPhoto, ...photos.slice(2)].filter(Boolean), // Ensure bride/groom photos are first two
    bridePhoto,
    groomPhoto,
    colorTheme,
  };

  // Inject CSS variables for color theme
  const themeStyles = colorTheme ? {
    '--theme-primary': colorTheme.colors.primary,
    '--theme-secondary': colorTheme.colors.secondary,
    '--theme-accent': colorTheme.colors.accent,
    '--theme-background': colorTheme.colors.background,
    '--theme-text': colorTheme.colors.text,
    '--theme-text-muted': colorTheme.colors.textMuted,
  } as React.CSSProperties : {};

  // Format meta tags data
  const brideName = templateProps.brideName || customFields.bride_nickname || "";
  const groomName = templateProps.groomName || customFields.groom_nickname || "";
  const eventDate = customFields.akad_date || customFields.reception_date || customFields.event_date || "";
  const formattedDate = eventDate ? format(new Date(eventDate), "d MMMM yyyy", { locale: id }) : "";
  
  const metaTitle = `${brideName} & ${groomName} - Undangan Pernikahan`;
  const metaDescription = formattedDate 
    ? `Dengan penuh kebahagiaan, kami mengundang Anda untuk berbagi kebahagiaan di hari pernikahan kami pada ${formattedDate}`
    : `Dengan penuh kebahagiaan, kami mengundang Anda untuk berbagi kebahagiaan di hari pernikahan kami`;
  const metaImage = bridePhoto || groomPhoto || photos[0] || invitation.template?.thumbnail_image || "";

  return (
    <>
      <MetaTags
        title={metaTitle}
        description={metaDescription}
        image={metaImage}
        type="website"
      />
      <InvitationShareButton
        url={window.location.href}
        brideName={brideName}
        groomName={groomName}
        image={metaImage}
        eventDate={formattedDate}
      />
      <div style={themeStyles}>
        <TemplateComponent {...templateProps} />
      </div>
    </>
  );
};

export default PublicInvitationPage;
