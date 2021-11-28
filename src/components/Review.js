import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import SignaturePad from 'signature_pad';

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
}));

export const Review = ({orderInfo, title = 'Подтверждение заказа', setOrderInfo}) => {
  const classes = useStyles();

  const addressesSender = Object.values(orderInfo.order.sender).slice(0,-2);
  const addressesRecipient = Object.values(orderInfo.order.recipient).slice(0, -2);
  const cardNumber = orderInfo.payment.cardNumber.split('').map((sign, index) => orderInfo.payment.cardNumber.length - index > 4 ? '*': sign);
  const payments = orderInfo.payment.online ? [
    { name: 'Тип оплаты', detail: 'Картой онлайн'},
    { name: 'Владелец карты', detail: orderInfo.payment.cardName},
    { name: 'Номер карты', detail: cardNumber},
    { name: 'Срок дейстия карты', detail: orderInfo.payment.expDate },
  ] : [
    { name: 'Тип оплаты', detail: 'Наличными курьеру'},
  ];

  const [signaturePad, setSignaturePad] = useState();
  // const canvas = document.querySelector("canvas");
  // const signaturePad = new SignaturePad(canvasRef);

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      // console.log('11111111111111111');
      setSignaturePad(new SignaturePad(canvas));
    }
  }, []);

  useEffect(() => {
    if (orderInfo.status === 'done' && signaturePad && orderInfo.signature) {
      signaturePad.fromDataURL(orderInfo.signature
      );
    }
  }, [orderInfo.signature, orderInfo.status, signaturePad]);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <List disablePadding>
        <ListItem className={classes.listItem}>
          <ListItemText primary="Доставка документов до двери" secondary="Посылка весом до 5кг" />
          <Typography variant="body2">{orderInfo.payment.price} ₽</Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Адрес отправителя
          </Typography>
          <Typography gutterBottom>{orderInfo.order.sender.number}</Typography>
          <Typography gutterBottom>{addressesSender.filter(item => item).join(', ')}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Адрес получателя
          </Typography>
          <Typography gutterBottom>{orderInfo.order.recipient.number}</Typography>
          <Typography gutterBottom>{addressesRecipient.filter(item => item).join(', ')}</Typography>
        </Grid>
        <Grid item container direction="column" xs={12}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Детали оплаты
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.detail}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
        { orderInfo.status }
        {
          (orderInfo.status === 'progress' || orderInfo.status === 'done') && <Grid item container direction="column" xs={12}>
            <Typography variant="h6" gutterBottom className={classes.title}>
              Роспись о получении
            </Typography>
            <Grid container>
              {orderInfo.status === 'progress' && <canvas onClick={() => setOrderInfo({...orderInfo, signature: btoa(signaturePad?.toDataURL())})} id="canvas" style={{border: '2px solid #ccc'}} />}
              {orderInfo.signature && orderInfo.status === 'done'   && <img src={atob(orderInfo.signature)} alt="signature" />
                // <canvas onClick={() => setOrderInfo({...orderInfo, signature: signaturePad.toDataURL()})} id="canvas" style={{border: '2px solid #ccc'}} />
              }
            </Grid>
          </Grid>
        }

      </Grid>
    </React.Fragment>
  );
}
