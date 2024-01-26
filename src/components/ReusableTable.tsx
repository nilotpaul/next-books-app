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

const ReusableTable = <T,>({ type, columns, rows, classNames, map }: ReusableTableProps<T>) => {
  return (
    <Table
      aria-label={type}
      classNames={{
        wrapper: 'shadow-md border-1 dark:border-0',
      }}
    >
      <TableHeader>
        {columns.map((item) => (
          <TableColumn key={item} className='capitalize'>
            {item}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody emptyContent={`${type} is empty!`}>
        {!map ? (
          <TableRow>
            {columns.map((_, index) => {
              const key = Object.keys(rows[0]!)[index];

              return (
                <TableCell key={index} className={cn('text-base', classNames?.cell)}>
                  {(rows[index] as Record<string, any>)[key]}
                </TableCell>
              );
            })}
          </TableRow>
        ) : (
          rows.map((item, index) => map(item, index))
        )}
      </TableBody>
    </Table>
  );
};

export default ReusableTable;
