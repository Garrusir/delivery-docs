import React, { useState } from 'react';
import {useHistory} from "react-router-dom";
import moment from "moment";

import {useStyles} from "../hooks/style.hook";
import {db} from '../firebase'
import {useAuth} from "../context/AuthContext";

import {AddressForm} from "../components/AddressForm";
import {PaymentForm} from "../components/PaymentForm";
import {Review} from "../components/Review";

import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";


function getStepContent(step, orderInfo, setOrderInfo) {
  switch (step) {
    case 0:
      return <AddressForm orderInfo={orderInfo} setOrderInfo={setOrderInfo}/>;
    case 1:
      return <PaymentForm orderInfo={orderInfo} setOrderInfo={setOrderInfo}/>;
    case 2:
      return <Review orderInfo={orderInfo}  />;
    default:
      throw new Error('Unknown step');
  }
}

const steps = ['Рассчитать доставку', 'Детали оплаты', 'Подтверждение заказа'];

export const CreateOrderPage = () => {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    order: {
      sender: {
        address: '',
        entrance: '',
        floor: '',
        room: '',
        intercom: '',
        number: '',
        comment: '',
      },
      recipient: {
        address: '',
        entrance: '',
        floor: '',
        room: '',
        intercom: '',
        number: '',
        comment: '',
      }
    },
    payment: {
      price: 200,
      online: false,
      cardName: '',
      cardNumber: '',
      expDate: '',
      cvv: '',
    },
  })
  const history = useHistory();



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(false);
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      const orderData = {
        address1: orderInfo.order.sender.address,
        entrance1: orderInfo.order.sender.entrance,
        floor1: orderInfo.order.sender.floor,
        room1: orderInfo.order.sender.room,
        intercom1: orderInfo.order.sender.intercom,
        number1: orderInfo.order.sender.number,
        comment1: orderInfo.order.sender.comment,
        address2: orderInfo.order.recipient.address,
        entrance2: orderInfo.order.recipient.entrance,
        floor2: orderInfo.order.recipient.floor,
        room2: orderInfo.order.recipient.room,
        intercom2: orderInfo.order.recipient.intercom,
        number2: orderInfo.order.recipient.number,
        comment2: orderInfo.order.recipient.comment,
        amount: orderInfo.payment.price,
        courier: null,
        date: moment(Date.now()).format('DD.MM.YY HH:mm'),
        user: currentUser.uid,
        online: orderInfo.payment.online,
        cardName: orderInfo.payment.cardName,
        cardNumber: orderInfo.payment.cardNumber,
        expDate: orderInfo.payment.expDate,
        status: 'open',
      };

      if (
        !orderData.address1 ||
        !orderData.number1 ||
        !orderData.address2 ||
        !orderData.number2
      ) {
        setActiveStep(0);
        setErrorMessage('Все поля обязательны для заполения');
        setError(true);
        return;
      }

      if (
        orderData.online &&
        (!orderData.cardName ||
        !orderData.cardNumber ||
        !orderData.expDate ||
        !orderInfo.payment.cvv)
      ) {
        setActiveStep(0);
        setErrorMessage('Не указаны реквизиты оплаты');
        setError(true);
        return;
      }

      setLoading(true);
      db.collection('orders').doc().set(orderData)
        .then((response) => {
          history.push('/orders');
        })
        .finally(() => {
        setLoading(false);
      })
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <main className={classes.layout}>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" align="center">
          Заказать доставку документов
        </Typography>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
               Заказ оформлен.
              </Typography>
              <Typography variant="subtitle1">
                Номер вашего заказа #2001539. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vestibulum mollis risus, id viverra mauris sodales quis.
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep, orderInfo, setOrderInfo)}
              <div className={classes.buttons}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} className={classes.button}>
                    Назад
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                  disabled={loading}
                >
                  {activeStep === steps.length - 1 ? 'Оформить заказ' : 'Далее'}
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      </Paper>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={error}
        autoHideDuration={6000}
        onClose={handleClose}
        message={errorMessage}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </main>
  )
}
