import { Share2 } from "lucide-react";
import { useState } from "react";
import { SocialShare } from "@/components/ui/SocialShare";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogs/dialog";

interface InvitationShareButtonProps {
  url: string;
  brideName: string;
  groomName: string;
  image: string;
  eventDate?: string;
}

export const InvitationShareButton = ({
  url,
  brideName,
  groomName,
  image,
  eventDate,
}: InvitationShareButtonProps) => {
  const [open, setOpen] = useState(false);

  const title = `${brideName} & ${groomName} - Undangan Pernikahan`;
  const description = eventDate
    ? `Kami mengundang Anda untuk berbagi kebahagiaan di hari pernikahan kami pada ${eventDate}`
    : `Kami mengundang Anda untuk berbagi kebahagiaan di hari pernikahan kami`;

  return (
    <>
      {/* Floating Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110"
            aria-label="Bagikan undangan"
          >
            <Share2 className="w-6 h-6" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bagikan Undangan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bagikan undangan pernikahan kami kepada keluarga dan teman
            </p>
            <div className="flex justify-center py-4">
              <SocialShare
                url={url}
                title={title}
                media={image}
                description={description}
                showLabel={false}
                iconSize={40}
              />
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-center text-muted-foreground">
                {url}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
