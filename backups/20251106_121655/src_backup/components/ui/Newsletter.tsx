import { Button } from "@/components/ui/button";

const InstagramFollow = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-foreground text-2xl uppercase tracking-wider font-normal mb-3">
            Follow Us on Instagram
          </h2>
          <p className="font-normal text-muted-foreground mb-6">
            Stay updated with our latest collections and behind-the-scenes content.
          </p>

          <a
            href="https://www.instagram.com/duaInsan.story"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-primary text-primary-foreground font-normal tracking-widest hover:bg-primary/70 px-8 py-3 rounded-none">
              @DuaInsan.Story
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFollow;

