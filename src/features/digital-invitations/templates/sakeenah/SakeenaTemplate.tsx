import { useEffect } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import "./sakeenah.css";

export interface SakeenaTemplateProps {
  brideNickname: string;
  groomNickname: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  eventTime?: string;
  venueName: string;
  venueAddress?: string;
  venueMapUrl?: string;
  additionalInfo?: string;
  photos: string[];
}

export const SakeenaTemplate = ({
  brideNickname,
  groomNickname,
  brideName,
  groomName,
  eventDate,
  eventTime,
  venueName,
  venueAddress,
  venueMapUrl,
  additionalInfo,
  photos,
}: SakeenaTemplateProps) => {
  // Extract first names for display
  const brideFirstName = brideNickname || brideName.split(" ")[0];
  const groomFirstName = groomNickname || groomName.split(" ")[0];

  // Format date
  const formattedDate = format(new Date(eventDate), "EEEE, dd MMMM yyyy", {
    locale: idLocale,
  });

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sakeena-template">
      {/* Hero Section */}
      <section className="sakeena-hero">
        <div className="sakeena-hero-overlay"></div>
        <div className="sakeena-hero-content">
          <div className="sakeena-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <h1 className="sakeena-couple-names">
            {brideFirstName} & {groomFirstName}
          </h1>
          <div className="sakeena-date-badge">{formattedDate}</div>
        </div>
        <div className="sakeena-scroll-indicator">
          <div className="sakeena-scroll-arrow"></div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="sakeena-section sakeena-intro">
        <div className="sakeena-container">
          <div className="sakeena-ayat">
            <p className="sakeena-ayat-arabic">
              وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا
              لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ
              فِى ذَٰلِكَ لَءَايَٰتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
            </p>
            <p className="sakeena-ayat-translation">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan
              untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan
              Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu
              benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."
            </p>
            <p className="sakeena-ayat-reference">— QS. Ar-Rum: 21</p>
          </div>
        </div>
      </section>

      {/* Couple Section */}
      <section className="sakeena-section sakeena-couple">
        <div className="sakeena-container">
          <h2 className="sakeena-section-title">Assalamu'alaikum Warahmatullahi Wabarakatuh</h2>
          <p className="sakeena-section-subtitle">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang
            Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:
          </p>

          <div className="sakeena-couple-grid">
            <div className="sakeena-couple-card">
              <div className="sakeena-couple-photo-wrapper">
                {photos[0] && (
                  <img
                    src={photos[0]}
                    alt={brideName}
                    className="sakeena-couple-photo"
                  />
                )}
              </div>
              <h3 className="sakeena-couple-name">{brideName}</h3>
              <p className="sakeena-couple-title">Mempelai Wanita</p>
            </div>

            <div className="sakeena-ampersand">&</div>

            <div className="sakeena-couple-card">
              <div className="sakeena-couple-photo-wrapper">
                {photos[1] && (
                  <img
                    src={photos[1]}
                    alt={groomName}
                    className="sakeena-couple-photo"
                  />
                )}
              </div>
              <h3 className="sakeena-couple-name">{groomName}</h3>
              <p className="sakeena-couple-title">Mempelai Pria</p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Section */}
      <section className="sakeena-section sakeena-event">
        <div className="sakeena-container">
          <h2 className="sakeena-section-title">Waktu & Tempat</h2>

          <div className="sakeena-event-card">
            <div className="sakeena-event-icon-wrapper">
              <Calendar className="sakeena-event-icon" />
            </div>
            <div className="sakeena-event-details">
              <h3 className="sakeena-event-label">Tanggal</h3>
              <p className="sakeena-event-value">{formattedDate}</p>
            </div>
          </div>

          {eventTime && (
            <div className="sakeena-event-card">
              <div className="sakeena-event-icon-wrapper">
                <Clock className="sakeena-event-icon" />
              </div>
              <div className="sakeena-event-details">
                <h3 className="sakeena-event-label">Waktu</h3>
                <p className="sakeena-event-value">{eventTime} WIB</p>
              </div>
            </div>
          )}

          <div className="sakeena-event-card">
            <div className="sakeena-event-icon-wrapper">
              <MapPin className="sakeena-event-icon" />
            </div>
            <div className="sakeena-event-details">
              <h3 className="sakeena-event-label">Tempat</h3>
              <p className="sakeena-event-value">{venueName}</p>
              {venueAddress && (
                <p className="sakeena-event-address">{venueAddress}</p>
              )}
            </div>
          </div>

          {venueMapUrl && (
            <a
              href={venueMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sakeena-map-button"
            >
              <MapPin className="sakeena-map-icon" />
              Buka Peta
            </a>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      {photos.length > 2 && (
        <section className="sakeena-section sakeena-gallery">
          <div className="sakeena-container">
            <h2 className="sakeena-section-title">Galeri Foto</h2>
            <div className="sakeena-gallery-grid">
              {photos.slice(2).map((photo, index) => (
                <div key={index} className="sakeena-gallery-item">
                  <img
                    src={photo}
                    alt={`Foto ${index + 3}`}
                    className="sakeena-gallery-photo"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional Info Section */}
      {additionalInfo && (
        <section className="sakeena-section sakeena-info">
          <div className="sakeena-container">
            <div className="sakeena-info-card">
              <p className="sakeena-info-text">{additionalInfo}</p>
            </div>
          </div>
        </section>
      )}

      {/* Closing Section */}
      <section className="sakeena-section sakeena-closing">
        <div className="sakeena-container">
          <div className="sakeena-closing-content">
            <p className="sakeena-closing-text">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
              Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan do'a restu kepada kami.
            </p>
            <p className="sakeena-closing-signature">
              Wassalamu'alaikum Warahmatullahi Wabarakatuh
            </p>
            <div className="sakeena-closing-names">
              Kami yang berbahagia,<br />
              {brideFirstName} & {groomFirstName}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
