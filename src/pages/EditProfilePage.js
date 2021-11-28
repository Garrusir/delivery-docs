import React from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {useStyles} from "../hooks/style.hook";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export const EditProfilePage = () => {
  const classes = useStyles();

  const handleSave = () => {
    console.log('save');
  }

  return (
    <main className={classes.layout}>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" align="center">
          Настройки профиля
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="name"
              name="name"
              label="Имя"
              fullWidth
              autoComplete="profile name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="surname"
              name="surname"
              label="Фамилия"
              fullWidth
              autoComplete="profile name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="number"
              name="number"
              label="Номер телефона"
              fullWidth
              autoComplete="shipping phone"
            />
          </Grid>
        </Grid>

        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            className={classes.button}
          >
            Сохранить
          </Button>
        </div>
      </Paper>
    </main>
  )
}
