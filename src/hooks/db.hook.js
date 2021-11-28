import {useEffect, useState} from "react";
import {db} from '../firebase'

export const useOrderList = () => {
  const [data, setData] = useState({ orderList: [] });
  const [userId, setUserId] = useState({ orderList: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (!userId) {
      db.collection('orders').get()
        .then(querySnapshot => {
          const orderList = [];
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            orderList.push({...doc.data(), id: doc.id});
          });
          setData({orderList});
        })
        .catch(e => setIsError(true))
        .finally(() => setIsLoading(false));
    } else {
      db.collection('orders').where("user", "==", userId).get()
        .then(querySnapshot => {
          const orderList = [];
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            orderList.push({...doc.data(), id: doc.id});
          });
          setData({orderList});
        })
        .catch(e => setIsError(true))
        .finally(() => setIsLoading(false));
    }
  }, [userId]);

  return [{ data, isLoading, isError }, setUserId];
}
