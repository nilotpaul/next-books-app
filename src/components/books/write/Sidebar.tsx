import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';

type SidebarProps = {};

const Sidebar = ({}: SidebarProps) => {
  return (
    <Card fullWidth>
      <CardHeader>header</CardHeader>

      <CardBody>body</CardBody>

      <CardFooter>footer</CardFooter>
    </Card>
  );
};

export default Sidebar;
