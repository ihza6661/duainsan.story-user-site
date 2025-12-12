import { useEffect } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { InvitationTemplateProps } from "../types";
import "./sakeenah.css";

export const SakeenaTemplate = (props: InvitationTemplateProps) => {
  // Extract fields - prioritize new custom_fields over legacy fields
  const brideFullName = props.brideFullName || props.brideName || "";
  const brideNickname = props.brideNickname || brideFullName.split(" ")[0];
  const brideParents = props.brideParents || "";
  
  const groomFullName = props.groomFullName || props.groomName || "";
  const groomNickname = props.groomNickname || groomFullName.split(" ")[0];
  const groomParents = props.groomParents || "";
  
  const akadDate = props.akadDate || props.eventDate || "";
  const akadTime = props.akadTime || props.eventTime || "";
  const akadLocation = props.akadLocation || props.venueName || "";
  
  const receptionDate = props.receptionDate || akadDate;
  const receptionTime = props.receptionTime || "";
  const receptionLocation = props.receptionLocation || props.venueAddress || "";
  
  const gmapsLink = props.gmapsLink || props.venueMapUrl || "";
  const preweddingPhoto = props.preweddingPhoto || "";
  const primaryColor = props.primaryColor || "#2C5F2D";
  
  const photos = props.photos || [];
  const additionalInfo = props.additionalInfo || "";

  // Extract first names for closing section (used in line 269)
  const brideFirstName = brideNickname || brideFullName.split(" ")[0];
  const groomFirstName = groomNickname || groomFullName.split(" ")[0];

  // Format dates
  const formattedAkadDate = akadDate ? format(new Date(akadDate), "EEEE, dd MMMM yyyy", {
    locale: idLocale,
  }) : "";
  
  const formattedReceptionDate = receptionDate ? format(new Date(receptionDate), "EEEE, dd MMMM yyyy", {
    locale: idLocale,
  }) : "";

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
            {brideNickname} & {groomNickname}
          </h1>
          <div className="sakeena-date-badge">{formattedAkadDate}</div>
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
                {(preweddingPhoto || photos[0]) && (
                  <img
                    src={preweddingPhoto || photos[0]}
                    alt={brideFullName}
                    className="sakeena-couple-photo"
                  />
                )}
              </div>
              <h3 className="sakeena-couple-name">{brideFullName}</h3>
              {brideParents && <p className="sakeena-couple-parents">{brideParents}</p>}
              <p className="sakeena-couple-title">Mempelai Wanita</p>
            </div>

            <div className="sakeena-ampersand">&</div>

            <div className="sakeena-couple-card">
              <div className="sakeena-couple-photo-wrapper">
                {(preweddingPhoto || photos[1]) && (
                  <img
                    src={preweddingPhoto || photos[1]}
                    alt={groomFullName}
                    className="sakeena-couple-photo"
                  />
                )}
              </div>
              <h3 className="sakeena-couple-name">{groomFullName}</h3>
              {groomParents && <p className="sakeena-couple-parents">{groomParents}</p>}
              <p className="sakeena-couple-title">Mempelai Pria</p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Section */}
      <section className="sakeena-section sakeena-event">
        <div className="sakeena-container">
          <h2 className="sakeena-section-title">Waktu & Tempat</h2>

          {/* Akad Nikah */}
          <div className="sakeena-event-card">
            <h4 className="sakeena-event-title">Akad Nikah</h4>
            <div className="sakeena-event-icon-wrapper">
              <Calendar className="sakeena-event-icon" />
            </div>
            <div className="sakeena-event-details">
              <h3 className="sakeena-event-label">Tanggal</h3>
              <p className="sakeena-event-value">{formattedAkadDate}</p>
            </div>
          </div>

          {akadTime && (
            <div className="sakeena-event-card">
              <div className="sakeena-event-icon-wrapper">
                <Clock className="sakeena-event-icon" />
              </div>
              <div className="sakeena-event-details">
                <h3 className="sakeena-event-label">Waktu</h3>
                <p className="sakeena-event-value">{akadTime} WIB</p>
              </div>
            </div>
          )}

          {akadLocation && (
            <div className="sakeena-event-card">
              <div className="sakeena-event-icon-wrapper">
                <MapPin className="sakeena-event-icon" />
              </div>
              <div className="sakeena-event-details">
                <h3 className="sakeena-event-label">Tempat</h3>
                <p className="sakeena-event-value">{akadLocation}</p>
              </div>
            </div>
          )}

          {/* Reception */}
          {receptionDate && (
            <>
              <div className="sakeena-event-divider"></div>
              <div className="sakeena-event-card">
                <h4 className="sakeena-event-title">Resepsi</h4>
                <div className="sakeena-event-icon-wrapper">
                  <Calendar className="sakeena-event-icon" />
                </div>
                <div className="sakeena-event-details">
                  <h3 className="sakeena-event-label">Tanggal</h3>
                  <p className="sakeena-event-value">{formattedReceptionDate}</p>
                </div>
              </div>

              {receptionTime && (
                <div className="sakeena-event-card">
                  <div className="sakeena-event-icon-wrapper">
                    <Clock className="sakeena-event-icon" />
                  </div>
                  <div className="sakeena-event-details">
                    <h3 className="sakeena-event-label">Waktu</h3>
                    <p className="sakeena-event-value">{receptionTime} WIB</p>
                  </div>
                </div>
              )}

              {receptionLocation && (
                <div className="sakeena-event-card">
                  <div className="sakeena-event-icon-wrapper">
                    <MapPin className="sakeena-event-icon" />
                  </div>
                  <div className="sakeena-event-details">
                    <h3 className="sakeena-event-label">Tempat</h3>
                    <p className="sakeena-event-value">{receptionLocation}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {gmapsLink && (
            <a
              href={gmapsLink}
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
