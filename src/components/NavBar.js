import React from "react";
import { Link as RouterLink }from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
    import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import {useAuth} from "../context/AuthContext";
import {useStyles} from "../hooks/style.hook";

export const NavBar = () => {
  const classes = useStyles();
  const {currentUser, signOut} = useAuth();

  const renderNavigation = () => {
    if (!currentUser) return <Button>Войти</Button>;

    switch (currentUser.role) {
      case 'user':
        return <nav>
          <Link style={{margin: '0 6px'}} component={RouterLink} to="/create" variant="button" color="textPrimary" href="#"
                className={classes.link}>
            Создать заказ
          </Link>
          <Link style={{margin: '0 6px'}} component={RouterLink} to="/orders" variant="button" color="textPrimary" href="#"
                className={classes.link}>
            Мои заказы
          </Link>
          <Link style={{margin: '0 6px'}} component={RouterLink} to="/profile" variant="button" color="textPrimary" href="#"
                className={classes.link}>
            Профиль
          </Link>
          <Link style={{margin: '0 6px'}} onClick={signOut} variant="button" color="textPrimary" href="#"
                className={classes.link}>
            Выйти
          </Link>
        </nav>;
      case 'courier':
        return <nav>
          <Link style={{margin: '0 6px'}} component={RouterLink} to="/orders-open" variant="button" color="textPrimary" href="#"
                className={classes.link}>
            Свободные заказы
          </Link>
          <Link style={{margin: '0 6px'}} component={RouterLink} to="/orders-taken" variant="button" color="textPrimary" href="#"
                className={classes.link}>
            Мои заказы
          </Link>
          <Link style={{margin: '0 6px'}} component={RouterLink} variant="button" color="textPrimary" href="#"
                className={classes.link}>
            Заработок
          </Link>
          <Link style={{margin: '0 6px'}} component={RouterLink} to="/profile" variant="button" color="textPrimary" href="#"
                className={classes.link}>
            Профиль
          </Link>
          <Link style={{margin: '0 6px'}} onClick={signOut} variant="button" color="textPrimary" href="#"
                className={classes.link}>
            Выйти
          </Link>
        </nav>;
      default:
        return <Button>Войти</Button>;
    }
  }

  return <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
    <Toolbar className={classes.toolbar}>
      <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
        Доставка документов
      </Typography>
      {renderNavigation()}
    </Toolbar>
  </AppBar>
}
