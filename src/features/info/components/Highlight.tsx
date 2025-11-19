import { Link } from "react-router-dom";

  const highlight = [
    {
      id: 1,
      title: "Green",
      image: "/highlight/2.png",
    },
    {
      id: 2,
      title: "Brown",
      image: "/highlight/3.png",
    },
  ];


   {/* Termin Pembayaran dan Free items Information */}
      <section className="pt-10 sm:pt-12 md:pt-16 bg-background">
        <div className="">
          <p className="text-center pt-10 text-xl">Cara Order via WhatsApp</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
            {highlight.map((post) => (
              <Link
                key={post.id}
                to={`/highlights/${post.id}`}
                className="group"
              >
                <div className="relative aspect-[2/3] p-5 sm:p-20 m-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full object-contain rounded-2xl"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>