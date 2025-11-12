import { paperTypes } from "@/lib/data";

const PaperTypes = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Jenis Kertas Undangan di Dua Insan Story
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Setiap jenis kertas memiliki karakteristik unik yang memberikan kesan berbeda pada undangan cetak Anda.
        </p>

        {paperTypes.map((category, idx) => (
          <div key={idx} className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {category.category}
            </h3>
            <p className="text-muted-foreground mb-4">{category.description}</p>
            <div className="overflow-x-auto">
              <table className="w-full bg-card border-collapse rounded shadow-sm">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-6 py-3 text-left font-semibold">UKURAN</th>
                    <th className="px-6 py-3 text-left font-semibold">HARGA</th>
                    <th className="px-6 py-3 text-left font-semibold">MIN.</th>
                  </tr>
                </thead>
                <tbody>
                  {category.items.map((item, itemIdx) => (
                    <tr key={itemIdx} className="border-b border-border hover:bg-muted">
                      <td className="px-6 py-4 text-foreground">{item.size}</td>
                      <td className="px-6 py-4 text-foreground">{item.price}</td>
                      <td className="px-6 py-4 text-foreground">{item.min}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* <p className="text-center text-sm text-muted-foreground mt-6">
          *Kertas dengan tekstur alis butterfly, glitter gundam tersedia dengan harga yang lebih tinggi.
        </p> */}
      </div>
    </div>
  );
};

export default PaperTypes;
