import React from "react";
import { Beer } from "../store/beer";

const BeerList = ({ beers }: { beers: Beer[] }) => {
  return (
    <ul className="List">
      {beers.map((beer) => {
        return (
          <li key={beer.id} className="List-item">
            <figure className="List-item-img">
              <img src={beer.image_url} alt="Beer" />
            </figure>
            <div className="List-item-info">
              <p>{beer.name}</p>
              <ul>
                <li>
                  <small>ABV: {beer.abv}</small>
                </li>
                <li>
                  <small>
                    Volume: {beer.volume.unit} {beer.volume.unit}
                  </small>
                </li>
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export { BeerList };
