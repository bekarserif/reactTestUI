import React from 'react'
import { useTable, useSortBy, useFilters, useColumnOrder } from 'react-table'
import makeData from '../utils/makeData'
import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField' 
import { motion, AnimatePresence } from 'framer-motion'
import matchSorter from 'match-sorter'

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <TextField
      id="outlined-basic"
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      label={`Search ${count} records...`}
      variant="outlined"
    />
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

function shuffle(arr) {
  arr = [...arr]
  const shuffled = []
  while (arr.length) {
    const rand = Math.floor(Math.random() * arr.length)
    shuffled.push(arr.splice(rand, 1)[0])
  }
  return shuffled
}


function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    flatColumns,
    prepareRow,
    setColumnOrder,
    state,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useColumnOrder,
    useFilters,
    useSortBy
  )

  const spring = React.useMemo(
    () => ({
      type: 'spring',
      damping: 50,
      stiffness: 100,
    }),
    []
  )

  const randomizeColumns = () => {
    setColumnOrder(shuffle(flatColumns.map(d => d.id)))
  }
  // Render the UI for your table
  return (
  <>
    {/* <Button variant="contained" color="primary" onClick={() => randomizeColumns({})}>Randomize Columns</Button>
    <MaUTable {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <TableCell {...column.getHeaderProps()}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </MaUTable> */}
    {/* <Button variant="contained" color="primary" onClick={() => randomizeColumns({})}>Randomize Columns</Button> */}
    <MaUTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup, i) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell
                  {...column.getHeaderProps({
                    layoutTransition: spring,
                    style: {
                      minWidth: column.minWidth,
                    },
                  })}
                >
                  <div {...column.getSortByToggleProps()}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : '  --'}
                    </span>
                  </div>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          <AnimatePresence>
            {rows.slice(0, 10).map(
              (row, i) => {
                prepareRow(row);
                return (
                  <motion.tr
                    {...row.getRowProps({
                      layoutTransition: spring,
                      exit: { opacity: 0, maxHeight: 0 },
                    })}
                  >
                    {row.cells.map((cell, i) => {
                      return (
                        <TableCell
                          {...cell.getCellProps({
                            layoutTransition: spring,
                          })}
                        >
                          {cell.render('Cell')}
                        </TableCell>
                      )
                    })}
                  </motion.tr>
                )}
            )}
          </AnimatePresence>
        </TableBody>
      </MaUTable>
      
      {/* <pre>
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre> */}
    </>
  )
}

export default function DataTable() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
          },
          {
            Header: 'Visits',
            accessor: 'visits',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
          },
        ],
      },
    ],
    []
  )

  const data = React.useMemo(() => makeData(100000), [])

  return (
    <div>
    <CssBaseline/>
      <Table columns={columns} data={data} />
    </div>
  )
}

