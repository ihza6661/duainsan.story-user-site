import { Instagram } from "lucide-react";

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  postUrl: string;
}

// Manual curation: Add your Instagram post URLs here
// To get Instagram post URLs: Go to instagram.com/duainsan.story, click on a post, copy the URL
const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "1",
    imageUrl: "/placeholder.svg", // Replace with actual image URL
    caption: "Beautiful wedding invitation design",
    postUrl: "https://www.instagram.com/p/EXAMPLE1/", // Replace with actual post URL
  },
  {
    id: "2",
    imageUrl: "/placeholder.svg", // Replace with actual image URL
    caption: "Custom digital invitations",
    postUrl: "https://www.instagram.com/p/EXAMPLE2/", // Replace with actual post URL
  },
  {
    id: "3",
    imageUrl: "/placeholder.svg", // Replace with actual image URL
    caption: "Elegant wedding themes",
    postUrl: "https://www.instagram.com/p/EXAMPLE3/", // Replace with actual post URL
  },
  {
    id: "4",
    imageUrl: "/placeholder.svg", // Replace with actual image URL
    caption: "Happy couples",
    postUrl: "https://www.instagram.com/p/EXAMPLE4/", // Replace with actual post URL
  },
];

interface InstagramFeedProps {
  maxPosts?: number;
}

export const InstagramFeed = ({ maxPosts = 4 }: InstagramFeedProps) => {
  const posts = INSTAGRAM_POSTS.slice(0, maxPosts);

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="w-8 h-8 text-pink-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Follow Us on Instagram
            </h2>
          </div>
          <p className="text-muted-foreground text-lg mb-4">
            @duainsan.story
          </p>
          <a
            href="https://www.instagram.com/duainsan.story/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <Instagram className="w-5 h-5" />
            Follow untuk inspirasi undangan pernikahan
          </a>
        </div>

        {/* Instagram Posts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
              {/* Image */}
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white" />
              </div>
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/duainsan.story/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Instagram className="w-5 h-5" />
            View More on Instagram
          </a>
        </div>
      </div>
    </section>
  );
};
