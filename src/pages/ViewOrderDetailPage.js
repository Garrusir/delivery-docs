import React, {useEffect, useState} from 'react';
import { useHistory, useParams } from "react-router-dom";

import {Review} from "../components/Review";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import {useStyles} from "../hooks/style.hook";
import {useAuth} from "../context/AuthContext";
import {useOrderList} from "../hooks/db.hook";
import {db} from "../firebase";

// const mockOrderInfo = {
//   order: {
//     sender: {
//       address: '1',
//       entrance: '1',
//       floor: '1',
//       room: '1',
//       intercom: '1',
//       number: '8 800 555 35 35',
//       comment: '1',
//     },
//     recipient: {
//       address: '',
//       entrance: '',
//       floor: '',
//       room: '',
//       intercom: '',
//       number: '',
//       comment: '',
//     }
//   },
//   payment: {
//     price: 200,
//     online: false,
//     cardName: '',
//     cardNumber: '',
//     expDate: '',
//     cvv: '',
//   }
// };

const getStatus = (status, role) => {
  if (role === 'user') {
    return {
      open: 'Поиск курьера',
      close: 'Заказ отменен',
      taken: 'Курьер на пути к вам',
      progress: 'Курьер доставляет посылку',
      done: 'Заказ доставлен'
    }[status];
  }

  if (role === 'courier') {
    return {
      open: 'Открытый заказ',
      close: 'Заказ отменен',
      taken: 'Заказ принят',
      progress: 'Доставка заказа',
      done: 'Заказ доставлен'
    }[status];
  }

}

export const ViewOrderDetailPage = () => {
  const classes = useStyles();
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const {currentUser} = useAuth();
  const history = useHistory();
  const [{data}, updateOrderList] = useOrderList();
  let { id } = useParams();

  const handleBack = () => {
    history.goBack();
  }
  const handleCancelOrder = (id) => {
    setLoading(true);
    db.collection('orders').doc(id).set({
      status: 'close'
    }, { merge: true })
      .then(() => {
        setOrderInfo({...orderInfo, status: 'close'});
      })
      .finally(() => {
      setLoading(false);
    })
  }

  const handleTakeOrder = () => {
    console.log('handleTakeOrder', id);
    setLoading(true);
    db.collection('orders').doc(id).set({
      status: 'taken',
      courier: currentUser.uid,
    }, { merge: true })
      .then(() => {
        setOrderInfo({...orderInfo, status: 'taken', courier: currentUser.uid});
      })
      .finally(() => {
        setLoading(false);
      })
  }

  const handleChangeStatus = (status) => {
    // console.log('change status on', status);
    // db.collection('orders').doc().set(orderData)
    setLoading(true);
    db.collection('orders').doc(id).set({
      status,
      signature: orderInfo.signature || '',
    }, { merge: true })
      .then(() => {
        setOrderInfo({...orderInfo, status});
      })
      .finally(() => {
        setLoading(false);
      })
  }


  const renderActions = () => {
    if (currentUser.role === 'courier') {
      return <React.Fragment>
        <Button onClick={handleBack} className={classes.button}>
          Назад
        </Button>
        {orderInfo.status === 'open' && <Button
          variant="contained"
          color="primary"
          onClick={handleTakeOrder}
          className={classes.button}
          disabled={loading}
        >
          Взять заказ
        </Button>}

        {orderInfo.status === 'taken' && <Button
          variant="contained"
          color="primary"
          onClick={() => handleChangeStatus('progress')}
          className={classes.button}
          disabled={loading}
        >
          Документы получены
        </Button>}

        {orderInfo.status === 'progress' && <Button
          variant="contained"
          color="primary"
          onClick={() => handleChangeStatus('done')}
          className={classes.button}
          disabled={loading}
        >
          Закрыть заказ
        </Button>}

      </React.Fragment>

    }
    return  <React.Fragment>
      <Button onClick={handleBack} className={classes.button}>
        Назад
      </Button>
      {orderInfo.status === 'open' &&
        <Button
        variant="contained"
        color="primary"
        onClick={() => handleCancelOrder(id)}
        className={classes.button}
        disabled={loading}
        >
        Отменить заказ
        </Button>
      }

    </React.Fragment>
  }

  useEffect(() => {
    if (currentUser) {
      updateOrderList('test2@test.test');
    }
  }, [currentUser, currentUser.uid, updateOrderList]);

  useEffect(() => {
    if (currentUser) {
      updateOrderList();
    }
  }, [currentUser, updateOrderList]);

  useEffect(() => {
    if (!data.orderList.length) {
      return;
    }

    const {
      address1,
      address2,
      amount,
      status,
      signature,
    } = data.orderList.find((item) => item.id === id);

    const orderInfo = {
      status,
      order: {
        sender: {
          address: address1 || '',
          entrance: '',
          floor: '',
          room: '',
          intercom: '',
          number: '',
          comment: '',
        },
        recipient: {
          address: address2 || '',
          entrance: '',
          floor: '',
          room: '',
          intercom: '',
          number: '',
          comment: '',
        }
      },
      payment: {
        price: amount,
        online: false,
        cardName: '',
        cardNumber: '',
        expDate: '',
        cvv: '',
      },
      signature,
    }

    setOrderInfo(orderInfo);
  },[data, id]);

  return (
    <main className={classes.layout}>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" align="center" style={{marginBottom: '24px'}}>
          Информация о заказе
        </Typography>
          {!orderInfo ? <Grid container spacing={3} style={{marginTop: '24px'}}>
              <CircularProgress style={{margin: 'auto'}}/>
            </Grid>
            : <Review
              orderInfo={orderInfo}
              title={getStatus(orderInfo.status, currentUser.role)}
              setOrderInfo={setOrderInfo}
            />
          }

        <div className={classes.buttons}>
          {orderInfo && renderActions()}
        </div>
      </Paper>
    </main>
  )
}
