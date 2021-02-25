import React from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { BeerList } from "./BeerList";
import { cancel, random } from "../store/beer/actions";
import { useSelector } from "../store";
import { setConfig } from "../store/actions";

const Beers = () => {
  const { beers, config } = useSelector(
    state => ({
      beers: state.beer,
      config: state.config,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  return (
    <>
      <div className="App-inputs">
        {/* <button
          type="button"
          onClick={() => dispatch(fetchData())}
          disabled={status === "pending"}
        >
          Fetch Beers!
        </button> */}
        <select
          name="per-page"
          defaultValue={config.perPage}
          onChange={(e) =>
            dispatch(setConfig({ perPage: Number(e.target.value) }))
          }
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => {
            return (
              <option key={value} value={value}>
                {value} results
              </option>
            );
          })}
        </select>
        <button
          type="button" 
          onClick={() => dispatch(random())}
        >
          Random
        </button>
        {/* <input
          type="text"
          placeholder="Search beers"
          onChange={(e) => dispatch(search(e.target.value))}
        /> */}
        {beers.status === "pending" && (
          <>
            <button type="button" onClick={() => dispatch(cancel())}>
              Cancel
            </button>
            <span className="App-spinner">
              {/* <img src={"/ajax-loader.gif"} alt="Spinner" /> */}
              Fetching data...
            </span>
          </>
        )}
      </div>
      {beers.status === "success" && (
        <div className="App-content">
          <BeerList beers={beers.data} />
        </div>
      )}
      {beers.status === "failure" && (
        <div className="App-messages">
          <p>Oops! {beers.messages[0].text}</p>
        </div>
      )}
    </>
  );
};

export { Beers };
