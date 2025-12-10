/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

// Display single Pokemon card with name and quantity component
function Card({ card, quantityComponent }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src={card.images.small}
        alt={card.name}
        className="img-fluid"
        style={{ maxHeight: '200px' }}
      />
      <p>{card.name}</p>
      {quantityComponent}
    </div>
  );
}
export default Card;
