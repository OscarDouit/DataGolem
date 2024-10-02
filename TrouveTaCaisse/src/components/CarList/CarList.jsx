import { useEffect, useState } from 'react';
import { getCarsData } from "../../service/car-service.jsx";

function CarList() {
  const [carList, setCarList] = useState();

  useEffect(()=>{
    getCarsData().then((r) => {
      setCarList(r)
      console.log(r)
      console.log(carList)
    })

    })

  return (
    <>
      <h3>Voici la liste des voitures :</h3>
      <ul>
        {carList && carList.map((car, index) => (
          <li key={index}>
            <p>{car.name} {car.brand}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default CarList;