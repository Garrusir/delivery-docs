import React, {useEffect, useState} from 'react';
import Link from '@material-ui/core/Link';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from "@material-ui/core/Typography";

import {useStyles} from "../hooks/style.hook";
import {Link as RouterLink} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {useOrderList} from "../hooks/db.hook";

// Generate Order Data
// function createData(id, date, shipFrom, shipTo, status, amount) {
//   return { id, date, shipFrom, shipTo, status, amount };
// }

// const rows = [
//   createData(0, '16 Mar, 2019', 'Москва, улица Остоженка, 22/1', 'Москва, улица Остоженка, 22/1', 'У курьера', 312.44),
//   createData(1, '16 Mar, 2019', 'Завершено', 'London, UK', 'VISA ⠀•••• 2574', 866.99),
//   createData(2, '16 Mar, 2019', 'Завершено', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
//   createData(3, '16 Mar, 2019', 'Завершено', 'Gary, IN', 'AMEX ⠀•••• 2000', 654.39),
//   createData(4, '15 Mar, 2019', 'Завершено', 'Long Branch, NJ', 'VISA ⠀•••• 5919', 212.79),
// ];

function preventDefault(event) {
  event.preventDefault();
}

export const ViewOrderListPage = ({page}) => {
  const classes = useStyles();
  const {currentUser} = useAuth();
  const [{data, isLoading}, updateOrderList] = useOrderList();
  const [filteredData, setFilteredData] = useState([]);

  const renderTitle = () => {
    console.info(page);
    if (page === 'open') {
      return 'Список открытых заказов'
    }

    if (page === 'taken') {
      return 'Список активных заказов'
    }

    return 'Список заказов';
  }

  useEffect(() => {
    if (currentUser && currentUser.role === 'user') {
      updateOrderList(currentUser.uid)
    } else {
      updateOrderList(null)
    }
  }, [currentUser, updateOrderList]);

  useEffect(() => {
    if (data && page === 'my') {
      setFilteredData(data.orderList);
    }

    if (data && page === 'open') {
      setFilteredData(data.orderList.filter(item => item.status === 'open'));
    }
    if (data && page === 'taken') {
      console.log('data.orderList', data.orderList.filter(item => item.courier === currentUser.uid));
      console.log('data.orderList', data.orderList);
      setFilteredData(data.orderList.filter(item => item.courier === 'test2@test.test'));

    }
  }, [currentUser.uid, data, page]);

  return (
    <React.Fragment>
      <main className={classes.layoutOrderList}>
        <Paper className={classes.paper}>
          {isLoading ? 'Загрузка' :
          <React.Fragment>
            <Typography component="h1" variant="h4" align="center">
              {renderTitle()}
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Откуда</TableCell>
                  <TableCell>Куда</TableCell>
                  {currentUser.role === 'user' && <TableCell>Статус</TableCell>}
                  <TableCell>Стоимость</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.id} className={{[classes.canceledOrder]: row.status === 'close' || row.status === 'done'}}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.address1}</TableCell>
                    <TableCell>{row.address2}</TableCell>
                    {currentUser.role === 'user' && <TableCell>{row.status}</TableCell>}
                    <TableCell>{row.amount}</TableCell>
                    <TableCell align="right">
                      <Link component={RouterLink} to={'/detail/' + row.id} href="#">
                        Подробнее
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className={classes.seeMore}>
              <Link color="primary" href="#" onClick={preventDefault}>
                Загрузить еще
              </Link>
            </div>
          </React.Fragment>}
        </Paper>
      </main>
    </React.Fragment>
  );
}
