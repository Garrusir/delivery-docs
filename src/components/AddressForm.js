import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';

// {(e) => setOrderInfo({...orderInfo, order: {...order, recipient: {...recipient, address: e.target.value}}})}
export const AddressForm = ({orderInfo, setOrderInfo}) => {
  const { order } = orderInfo;
  const { sender, recipient } = order;
  const [showSenderComment, setShowSenderComment] = useState(false);
  const [showRecipientComment, setShowRecipientComment] = useState(false);
  const [options, setOptions] = useState([]);

  function getAutocomplete(e) {
    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    const token = "7153262bffba9c12824abe54ad9f7d17394a4cdb";

    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + token
      },
      body: JSON.stringify({query: e.target.value})
    }

    fetch(url, options)
      .then(response => response.json())
      .then(async (result) => {
        console.info(result.suggestions)
        setOptions(result.suggestions)
      })
      .catch(error => console.log("error", error));
  }


  return (<React.Fragment>
      <Typography variant="h6" gutterBottom>
        Откуда
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            id="combo-box-demo"
            options={options}
            filterOptions={(x) => x}
            getOptionLabel={(option) => option.value}
            onClose={e =>  setOrderInfo({...orderInfo, order: {...order, sender: {...sender, address: e.target.textContent  || e.target.outerText || e.target.defaultValue}}})}
            renderInput={(params) => <TextField
              {...params}
              required
              value={sender.address}
              onChange={getAutocomplete}
              id="address1"
              name="address1"
              label="Адрес отправителя"
              fullWidth
              autoComplete="shipping address-line1"
            />}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            value={sender.entrance}
            onChange={(e) => setOrderInfo({...orderInfo, order: {...order, sender: {...sender, entrance: e.target.value}}})}
            id="entrance1"
            name="entrance1"
            label="Подъезд"
            fullWidth
            autoComplete="shipping"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            value={sender.floor}
            onChange={(e) => setOrderInfo({...orderInfo, order: {...order, sender: {...sender, floor: e.target.value}}})}
            id="floor1"
            name="floor1"
            label="Этаж"
            fullWidth
            autoComplete="shipping"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            value={sender.room}
            onChange={(e) => setOrderInfo({...orderInfo, order: {...order, sender: {...sender, room: e.target.value}}})}
            id="room1"
            name="room1"
            label="Квартира"
            fullWidth
            autoComplete="shipping"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            value={sender.intercom}
            onChange={(e) => setOrderInfo({...orderInfo, order: {...order, sender: {...sender, intercom: e.target.value}}})}
            id="intercom1"
            name="intercom1"
            label="Домофон"
            fullWidth
            autoComplete="shipping"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            value={sender.number}
            onChange={(e) => setOrderInfo({...orderInfo, order: {...order, sender: {...sender, number: e.target.value}}})}
            id="number1"
            name="number1"
            label="Номер отправителя"
            fullWidth
            autoComplete="shipping phone"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" name="showSenderComment" value={showSenderComment} onChange={() => setShowSenderComment(!showSenderComment)}/>}
            label="Добавить комментарий"
          />
        </Grid>
        {(showSenderComment || sender.comment) && <Grid item xs={12} sm={12}>
          <TextField
            value={sender.comment}
            onChange={(e) => setOrderInfo({...orderInfo, order: {...order, sender: {...sender, comment: e.target.value}}})}
            id="comment"
            name="comment"
            label="Комментарий"
            fullWidth
            multiline
            autoComplete="sender-comment"
          />
        </Grid>}
      </Grid>

      <Typography variant="h6" gutterBottom style={{marginTop: '24px'}}>
        Куда
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            id="combo-box-demo"
            options={options}
            filterOptions={x => x}
            getOptionLabel={(option) => option.value}
            onClose={e => setOrderInfo({...orderInfo, order: {...order, recipient: {...recipient, address:  e.target.outerText || e.target.textContent || e.target.defaultValue}}})}
            renderInput={(params) => <TextField
              {...params}
              required
              value={recipient.address}
              onChange={getAutocomplete}
              id="address2"
              name="address2"
              label="Адрес получателя"
              fullWidth
              autoComplete="shipping address-line1"
            />}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            value={recipient.entrance}
            onChange={(e) => setOrderInfo({...orderInfo, order: {...order, recipient: {...recipient, entrance: e.target.value}}})}
            id="entrance2"
            name="entrance2"
            label="Подъезд"
            fullWidth
            autoComplete="shipping"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            value={recipient.floor}
            onChange={(e) => setOrderInfo({...orderInfo, order: {...order, recipient: {...recipient, floor: e.target.value}}})}
            id="floor2"
            name="floor2"
            label="Этаж"
            fullWidth
            autoComplete="shipping"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            value={recipient.room}
            onChange={(e) => setOrderInfo({...orderInfo, order: {...order, recipient: {...recipient, room: e.target.value}}})}
            id="room2"
            name="room2"
            label="Квартира"
            fullWidth
            autoComplete="shipping"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            value={recipient.intercom}
            onChange={(e) => setOrderInfo({...orderInfo, order: {...order, recipient: {...recipient, intercom: e.target.value}}})}
            id="intercom2"
            name="intercom2"
            label="Домофон"
            fullWidth
            autoComplete="shipping"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            value={recipient.number}
            onChange={(e) => setOrderInfo({...orderInfo, order: {...order, recipient: {...recipient, number: e.target.value}}})}
            id="number2"
            name="number2"
            label="Номер получателя"
            fullWidth
            autoComplete="shipping phone"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" name="showSenderComment" value={showRecipientComment} onChange={() => setShowRecipientComment(!showRecipientComment)}/>}
            label="Добавить комментарий"
          />
        </Grid>
        {(showRecipientComment || recipient.comment) && <Grid item xs={12} sm={12}>
          <TextField
            value={recipient.comment}
            onChange={(e) => setOrderInfo({...orderInfo, order: {...order, recipient: {...recipient, comment: e.target.value}}})}
            id="comment"
            name="comment"
            label="Комментарий"
            fullWidth
            multiline
            autoComplete="recipient-comment"
          />
        </Grid>}
      </Grid>
  </React.Fragment>);
};
