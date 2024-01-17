import { Table, TableBody, TableHeader, TableRow, TableColumn, TableCell } from '@nextui-org/table';
import { cn } from '@/utils/utils';

type ReusableTableProps<T> = {
  type: string;
  columns: string[];
  rows: T[];
  classNames?: {
    cell?: string;
  };
  map?: (item: T, index: number) => JSX.Element;
};

const ReusableTable = <T, _>({ type, columns, rows, classNames, map }: ReusableTableProps<T>) => {
  return (
    <Table aria-label={type}>
      <TableHeader>
        {columns.map((item) => (
          <TableColumn key={item} className='capitalize'>
            {item}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody emptyContent={`${type} is empty!`}>
        {!map
          ? rows.map((item, index) => {
              const [[key]] = Object.entries(item as Record<string, any>);

              return (
                <TableRow key={index}>
                  <TableCell className={cn('text-base', classNames?.cell)}>
                    {(item as Record<string, any>)[key]}
                  </TableCell>
                </TableRow>
              );
            })
          : rows.map((item, index) => map(item, index))}
      </TableBody>
    </Table>
  );
};

export default ReusableTable;
