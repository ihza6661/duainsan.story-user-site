const ActualBrandSlider = () => {
  const brands = [
    '/brand_logo/duainsan.png',
    '/brand_logo/duainsan.png',
    '/brand_logo/duainsan.png',
    '/brand_logo/duainsan.png',
    '/brand_logo/duainsan.png',
    '/brand_logo/duainsan.png',
  ];

  const brandItems = brands.map((src, idx) => (
    <div className="item" key={idx}>
      <img src={src} alt={`Brand ${idx + 1}`} />
    </div>
  ));

  return (
    <div className="slider">
      <div className="list">
        {[...Array(3)].flatMap((_, i) =>
          brandItems.map((item, j) => (
            <div className="item" key={`${i}-${j}`}>
              {item.props.children}
            </div>
          ))
        )}
      </div>
    </div>

  );
};


export default ActualBrandSlider;
