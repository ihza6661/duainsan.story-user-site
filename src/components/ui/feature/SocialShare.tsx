import {
  PinterestShareButton,
  PinterestIcon,
} from "react-share";
import { Instagram } from "lucide-react";

interface SocialShareProps {
  url: string;
  title: string;
  media: string;
}

export const SocialShare = ({ url, title, media }: SocialShareProps) => {
  const instagramUrl = "https://www.instagram.com/duainsan.story/";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Share:</span>
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <Instagram className="w-5 h-5 text-gray-800" />
        </div>
      </a>
      {/* <PinterestShareButton url={url} media={media} description={title}> */}
      {/*   <PinterestIcon size={32} round /> */}
      {/* </PinterestShareButton> */}
    </div>
  );
};
