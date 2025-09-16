
import { FaWhatsapp, FaPaintBrush, FaComments, FaPrint, FaCheckDouble, FaShippingFast } from 'react-icons/fa';

const InfoPemesananCetak = () => {
  const steps = [
    {
      icon: <FaComments className="text-4xl" />,
      title: '1. Hubungi Customer Service',
      description: 'Hubungi kami melalui WhatsApp untuk mendiskusikan konsep dan kebutuhan undangan cetak Anda.',
    },
    {
      icon: <FaPaintBrush className="text-4xl" />,
      title: '2. Konsultasi & Proses Desain',
      description: 'Tim desainer kami akan membantu mewujudkan desain impian Anda. Proses desain dimulai setelah konfirmasi.',
    },
    {
      icon: <FaCheckDouble className="text-4xl" />,
      title: '3. Revisi Desain',
      description: 'Anda dapat mengajukan revisi hingga desain sesuai dengan keinginan Anda sebelum proses cetak dimulai.',
    },
    {
      icon: <FaPrint className="text-4xl" />,
      title: '4. Proses Cetak',
      description: 'Setelah desain final disetujui, kami akan memulai proses pencetakan dengan kualitas terbaik.',
    },
    {
      icon: <FaShippingFast className="text-4xl" />,
      title: '5. Pelunasan & Pengiriman',
      description: 'Lakukan pelunasan dan undangan Anda siap kami kirimkan ke alamat tujuan dengan aman.',
    },
     {
      icon: <FaWhatsapp className="text-4xl" />,
      title: 'Hubungi Kami Sekarang',
      description: 'Siap untuk memulai? Klik tombol di bawah untuk langsung terhubung dengan kami di WhatsApp!',
    },
  ];

  const paperTypes = [
    {
      name: 'Art Carton 260gr',
      description: 'Tebal, permukaan glossy atau doff. Pilihan populer untuk kesan mewah.',
      price: 'Rp 2.500 / pcs',
    },
    {
      name: 'Jasmine Paper',
      description: 'Memiliki efek kerlip glitter yang elegan dan terkesan mewah.',
      price: 'Rp 3.000 / pcs',
    },
    {
      name: 'Ivory Paper',
      description: 'Mirip Art Carton, namun dengan satu sisi licin dan sisi lain lebih redup.',
      price: 'Rp 2.300 / pcs',
    },
    {
      name: 'Linen Japan',
      description: 'Permukaan bertekstur garis-garis halus, memberikan kesan natural dan artistik.',
      price: 'Rp 2.800 / pcs',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-24 font-serif">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Pesan Undangan Cetak Custom</h1>
        {/* <p className="text-lg text-gray-600 mt-4">Wujudkan undangan impian Anda bersama Dua Insan Story. Kualitas terbaik dengan desain eksklusif.</p> */}
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Alur Pemesanan</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="mr-6">
                {step.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-700">{step.title}</h3>
                <p className="text-gray-600 mt-2">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Bagian Harga dan Jenis Kertas --- */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Pilihan Kertas & Estimasi Harga</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kertas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Mulai Dari</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paperTypes.map((paper) => (
                <tr key={paper.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paper.name}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{paper.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paper.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">*Harga dapat berubah tergantung kerumitan desain, jumlah, dan finishing. Hubungi kami untuk penawaran final.</p>
      </div>

      <div className="text-center mt-12">
        <a
          href="https://wa.me/6281234567890" // Ganti dengan nomor WhatsApp Anda
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-bold rounded-full shadow-md hover:bg-green-600 transition-colors duration-300 text-lg"
        >
          <FaWhatsapp className="mr-3 text-2xl" />
          Hubungi via WhatsApp
        </a>
      </div>
    </div>
  );
};

export default InfoPemesananCetak;
