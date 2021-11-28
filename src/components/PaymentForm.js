import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Checkbox, Switch} from "@material-ui/core";

export const PaymentForm = ({orderInfo, setOrderInfo}) =>   {
  const { payment } = orderInfo;

  const handleChange = () => {
    setOrderInfo({...orderInfo, payment: {...payment, online: !online}})
  }
  const {
    online,
    cardNumber,
    cardName,
    expDate,
    cvv,
  } = payment;

  return (
    <React.Fragment>

      <Typography variant="h6" gutterBottom>
       Стоимость доставки 200 ₽
      </Typography>
      <Typography variant="caption" gutterBottom>
        {!online ? 'Оплата курьеру при передаче документов' : 'Оплата онлайн'}
      </Typography>
      { orderInfo.payment.online }
      <Grid container spacing={3} style={{marginTop: '24px'}}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch
              color="primary"
              name="saveCard"
              value={online}
              onChange={handleChange}
            />}
            label="Оплатить картой онлайн"
          />
        </Grid>

        {online && <React.Fragment>
          <Grid item xs={12} md={6}>
            <TextField
              required
              value={cardName}
              onChange={(e) => setOrderInfo({...orderInfo, payment: {...payment, cardName: e.target.value}})}
              id="cardName"
              label="Name on card"
              fullWidth
              autoComplete="cc-name" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              value={cardNumber}
              onChange={(e) => setOrderInfo({...orderInfo, payment: {...payment, cardNumber: e.target.value}})}
              id="cardNumber"
              label="Card number"
              fullWidth
              autoComplete="cc-number"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              value={expDate}
              onChange={(e) => setOrderInfo({...orderInfo, payment: {...payment, expDate: e.target.value}})}
              id="expDate"
              label="Expiry date"
              fullWidth
              autoComplete="cc-exp" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              value={cvv}
              onChange={(e) => setOrderInfo({...orderInfo, payment: {...payment, cvv: e.target.value}})}
              id="cvv"
              label="CVV"
              helperText="Last three digits on signature strip"
              fullWidth
              autoComplete="cc-csc"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox color="primary" name="saveCard" value="yes" />}
              label="Запомнить карту"
            />
          </Grid>
        </React.Fragment>}
      </Grid>
    </React.Fragment>
  );
}
