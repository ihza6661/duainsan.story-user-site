import { useEffect } from "react";
import { Calendar, MapPin, Clock, Heart } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import "./classic.css";

export interface ClassicTemplateProps {
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

export const ClassicTemplate = ({
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
}: ClassicTemplateProps) => {
  // Extract first names for display
  const brideFirstName = brideNickname || brideName.split(" ")[0];
  const groomFirstName = groomNickname || groomName.split(" ")[0];

  // Format date
  const formattedDate = format(new Date(eventDate), "EEEE, dd MMMM yyyy", {
    locale: idLocale,
  });

  const eventMonth = format(new Date(eventDate), "MMMM", { locale: idLocale });
  const eventDay = format(new Date(eventDate), "dd");
  const eventYear = format(new Date(eventDate), "yyyy");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="classic-template">
      {/* Hero Section with Ornamental Design */}
      <section className="classic-hero">
        <div className="classic-ornament-top"></div>
        <div className="classic-hero-content">
          <div className="classic-invitation-label">The Wedding of</div>
          <h1 className="classic-couple-names">
            {brideFirstName}
            <span className="classic-ampersand">&</span>
            {groomFirstName}
          </h1>
          <div className="classic-date-container">
            <div className="classic-date-ornament"></div>
            <div className="classic-date-box">
              <div className="classic-date-day">{eventDay}</div>
              <div className="classic-date-month">{eventMonth}</div>
              <div className="classic-date-year">{eventYear}</div>
            </div>
            <div className="classic-date-ornament"></div>
          </div>
        </div>
        <div className="classic-ornament-bottom"></div>
      </section>

      {/* Quote Section */}
      <section className="classic-section classic-quote-section">
        <div className="classic-container">
          <div className="classic-quote">
            <Heart className="classic-quote-icon" />
            <p className="classic-quote-text">
              "Cinta sejati bukan tentang kesempurnaan, tetapi tentang menerima
              kekurangan satu sama lain dan tumbuh bersama dalam kebahagiaan."
            </p>
          </div>
        </div>
      </section>

      {/* Couple Details Section */}
      <section className="classic-section classic-couple-section">
        <div className="classic-container">
          <h2 className="classic-section-title">Mempelai</h2>
          <div className="classic-divider"></div>

          <div className="classic-couple-grid">
            {/* Bride */}
            <div className="classic-person-card">
              {photos[0] && (
                <div className="classic-person-photo-wrapper">
                  <div className="classic-photo-frame">
                    <img
                      src={photos[0]}
                      alt={brideName}
                      className="classic-person-photo"
                    />
                  </div>
                </div>
              )}
              <h3 className="classic-person-name">{brideName}</h3>
              <div className="classic-person-label">Mempelai Wanita</div>
            </div>

            {/* Groom */}
            <div className="classic-person-card">
              {photos[1] && (
                <div className="classic-person-photo-wrapper">
                  <div className="classic-photo-frame">
                    <img
                      src={photos[1]}
                      alt={groomName}
                      className="classic-person-photo"
                    />
                  </div>
                </div>
              )}
              <h3 className="classic-person-name">{groomName}</h3>
              <div className="classic-person-label">Mempelai Pria</div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="classic-section classic-details-section">
        <div className="classic-container">
          <h2 className="classic-section-title">Acara</h2>
          <div className="classic-divider"></div>

          <div className="classic-details-card">
            <div className="classic-detail-item">
              <Calendar className="classic-detail-icon" />
              <div className="classic-detail-content">
                <div className="classic-detail-label">Tanggal</div>
                <div className="classic-detail-value">{formattedDate}</div>
              </div>
            </div>

            {eventTime && (
              <div className="classic-detail-item">
                <Clock className="classic-detail-icon" />
                <div className="classic-detail-content">
                  <div className="classic-detail-label">Waktu</div>
                  <div className="classic-detail-value">{eventTime} WIB</div>
                </div>
              </div>
            )}

            <div className="classic-detail-item">
              <MapPin className="classic-detail-icon" />
              <div className="classic-detail-content">
                <div className="classic-detail-label">Lokasi</div>
                <div className="classic-detail-value">{venueName}</div>
                {venueAddress && (
                  <div className="classic-detail-address">{venueAddress}</div>
                )}
              </div>
            </div>

            {venueMapUrl && (
              <a
                href={venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="classic-map-link"
              >
                <MapPin size={18} />
                Lihat Lokasi di Peta
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      {photos.length > 2 && (
        <section className="classic-section classic-gallery-section">
          <div className="classic-container">
            <h2 className="classic-section-title">Galeri</h2>
            <div className="classic-divider"></div>

            <div className="classic-gallery">
              {photos.slice(2).map((photo, index) => (
                <div key={index} className="classic-gallery-item">
                  <div className="classic-gallery-frame">
                    <img
                      src={photo}
                      alt={`Foto ${index + 3}`}
                      className="classic-gallery-photo"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional Info */}
      {additionalInfo && (
        <section className="classic-section classic-info-section">
          <div className="classic-container">
            <div className="classic-info-box">
              <p className="classic-info-text">{additionalInfo}</p>
            </div>
          </div>
        </section>
      )}

      {/* Closing Section */}
      <section className="classic-section classic-closing-section">
        <div className="classic-container">
          <div className="classic-closing-ornament"></div>
          <p className="classic-closing-text">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          </p>
          <div className="classic-closing-signature">
            Terima kasih,
            <br />
            <span className="classic-signature-names">
              {brideFirstName} & {groomFirstName}
            </span>
          </div>
          <div className="classic-closing-ornament"></div>
        </div>
      </section>
    </div>
  );
};
