import React, { useState } from 'react';
import { Shield, Lock, Eye, Users, FileText, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'interpretation',
      title: 'Interpretasi dan Definisi',
      icon: <FileText className="w-5 h-5" />,
      content: `Kata-kata dengan huruf kapital awal memiliki arti yang didefinisikan dalam kondisi berikut. Definisi berikut akan memiliki arti yang sama terlepas dari apakah mereka muncul dalam bentuk tunggal atau jamak.`
    },
    {
      id: 'collecting',
      title: 'Pengumpulan dan Penggunaan Data Pribadi Anda',
      icon: <Eye className="w-5 h-5" />,
      content: `Kami mengumpulkan beberapa jenis informasi yang berbeda untuk berbagai tujuan untuk menyediakan dan meningkatkan Layanan kami kepada Anda.`
    },
    {
      id: 'usage',
      title: 'Jenis Data yang Dikumpulkan',
      icon: <Lock className="w-5 h-5" />,
      content: `Data Pribadi: Saat menggunakan Layanan kami, kami mungkin meminta Anda untuk memberikan kami informasi pengenal pribadi tertentu yang dapat digunakan untuk menghubungi atau mengidentifikasi Anda.`
    },
    {
      id: 'security',
      title: 'Keamanan Data Pribadi Anda',
      icon: <Shield className="w-5 h-5" />,
      content: `Keamanan Data Pribadi Anda penting bagi kami, tetapi ingatlah bahwa tidak ada metode transmisi melalui Internet yang 100% aman.`
    },
    {
      id: 'children',
      title: 'Privasi Anak-Anak',
      icon: <Users className="w-5 h-5" />,
      content: `Layanan kami tidak ditujukan untuk siapa pun yang berusia di bawah 13 tahun. Kami tidak dengan sengaja mengumpulkan informasi pengenal pribadi dari siapa pun yang berusia di bawah 13 tahun.`
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-16 sm:pt-27">

      {/* Hero Section */}
      <div className="container mx-auto px-10 py-10 max-w-4xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl mb-4 text-foreground">
            Kebijakan Privasi
          </h1>
          <p className="text-muted-foreground">
            Terakhir diperbarui: 05 November 2025
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Kebijakan Privasi</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Introduction */}
        <section className="mb-12 pb-12 border-b-2 border-border">
          <p className="text-muted-foreground leading-relaxed mb-4">
            Kebijakan Privasi ini menjelaskan kebijakan dan prosedur Kami tentang pengumpulan, penggunaan, dan pengungkapan informasi Anda saat Anda menggunakan Layanan dan memberi tahu Anda tentang hak privasi Anda dan bagaimana hukum melindungi Anda.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Kami menggunakan data Pribadi Anda untuk menyediakan dan meningkatkan Layanan. Dengan menggunakan Layanan, Anda setuju dengan pengumpulan dan penggunaan informasi sesuai dengan Kebijakan Privasi ini.
          </p>
        </section>

        {/* Expandable Sections */}
        <div className="space-y-4 mb-12">
          {sections.map((section) => (
            <div key={section.id} className="border-2 border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 bg-background hover:bg-secondary transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary text-primary-foreground rounded">
                    {section.icon}
                  </div>
                  <h2 className="text-foreground text-xl text-left">{section.title}</h2>
                </div>
                {expandedSection === section.id ? (
                  <ChevronUp className="w-6 h-6 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 flex-shrink-0" />
                )}
              </button>
              {expandedSection === section.id && (
                <div className="p-6 bg-secondary border-t-2 border-border">
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <section className="bg-secondary text-primary-foreground rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-foreground" />
            <h2 className="text-secondary-foreground text-2xl">Kontak Kami</h2>
          </div>
          <p className="text-secondary-foreground/80 mb-4">
            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, Anda dapat menghubungi kami:
          </p>
          <ul className="space-y-2 text-secondary-foreground/80">
            <li>• Melalui email: duainsan@story.com</li>
            <li>• Dengan mengunjungi halaman ini di situs web kami: www.duainsan.com/contact</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
