import { Button } from "@/components/ui/buttons/button";

const InstagramFollow = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-foreground text-2xl uppercase tracking-wider font-normal mb-3">
            Ikuti Kami di Instagram
          </h2>
          <p className="font-normal text-muted-foreground mb-6">
            Tetap update dengan koleksi terbaru dan konten di balik layar kami.
          </p>

          <a
            href="https://www.instagram.com/duaInsan.story"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-primary text-primary-foreground font-normal tracking-widest hover:bg-primary/70 px-8 py-3 rounded-none">
              @duainsan.story
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFollow;
