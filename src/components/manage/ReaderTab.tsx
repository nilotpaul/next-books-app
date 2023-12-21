import { getUserName } from '@/utils/getUserFullName';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Switch } from '@nextui-org/switch';
import { Chip } from '@nextui-org/chip';
import { Card, CardHeader, CardFooter, CardBody } from '@nextui-org/card';
import { Select, SelectItem } from '@nextui-org/select';
import { Alert, AlertDescription } from '../ui/Alert';
import { AlertCircle } from 'lucide-react';
import Link from '../ui/Link';
import Image from '../ui/Image';
import Divider from '../ui/Divider';
import { colors, fontSizes } from '@/config/constants/preferences';

type ReaderTabProps = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image: string;
};

const ReaderTab = ({ firstName, lastName, username, email, image }: ReaderTabProps) => {
  const { fullName } = getUserName(firstName, lastName);

  return (
    <div className='space-y-2'>
      <Card fullWidth className='space-y-2'>
        <CardHeader className='flex w-[150px] flex-col items-start pb-1 text-lg font-semibold text-foreground-600'>
          Reader Profile <Divider className='w-[150px]' />
        </CardHeader>

        <CardBody className='py-2'>
          <div className='flex items-center justify-start space-x-3'>
            <Image
              src={image}
              alt={fullName}
              aria-label='Reader image'
              isBlurred
              priority
              loading='eager'
              radius='full'
              fill
              classNames={{
                wrapper: 'relative min-h-[150px] min-w-[150px] rounded-full',
                blurredImg: 'scale-[0.9]',
              }}
            />

            <div className='w-full space-y-2'>
              <Chip size='sm' className='text-sm font-bold' color='primary' variant='flat'>
                @{username}
              </Chip>

              <Input
                type='text'
                label='Name'
                variant='faded'
                size='sm'
                classNames={{
                  inputWrapper: 'border-none',
                }}
                className='w-1/2'
                value={fullName}
                readOnly
              />
              <Input
                type='email'
                label='Email'
                variant='faded'
                size='sm'
                classNames={{
                  inputWrapper: 'border-none',
                }}
                className='w-1/2'
                value={email}
                readOnly
              />
            </div>
          </div>

          <CardFooter className='px-0'>
            <Alert variant='danger' className='w-fit py-2 font-semibold'>
              <AlertDescription className='flex items-center gap-2'>
                <AlertCircle className='h-5 w-5' />
                <Link href='/profile' color='danger' className='text-xs' underline='hover'>
                  Go to profile to edit these
                </Link>
              </AlertDescription>
            </Alert>
          </CardFooter>
        </CardBody>
      </Card>

      <Card fullWidth className='space-y-2'>
        <CardHeader className='flex flex-col items-start pb-1 text-lg font-semibold text-foreground-600'>
          Reading Preferences <Divider className='w-[210px]' />
        </CardHeader>

        <CardBody className='space-y-2'>
          <Select size='sm' variant='bordered' label='Font Size' placeholder='Select a font size'>
            {fontSizes.map((size, index) => (
              <SelectItem
                key={`${size}-${index}`}
                value={size + 'px'}
                textValue={size.toString() + 'px'}
              >
                {size}px
              </SelectItem>
            ))}
          </Select>

          <Select size='sm' variant='bordered' label='Reader Color' placeholder='Select a color'>
            {colors.map((color, index) => (
              <SelectItem
                key={`${color}-${index}`}
                className='capitalize'
                value={color.toLowerCase()}
              >
                {color}
              </SelectItem>
            ))}
          </Select>
        </CardBody>
      </Card>

      <Card fullWidth className='space-y-2'>
        <CardHeader className='flex flex-col items-start pb-1 text-lg font-semibold text-foreground-600'>
          Extras <Divider className='h-[1px] w-[85px]' />
        </CardHeader>

        <CardBody className='flex flex-col gap-4'>
          <div className='space-x-3'>
            <Button className='w-max' size='sm' variant='ghost'>
              Bookmarks
            </Button>
            <Button className='w-max' size='sm' variant='ghost'>
              History
            </Button>
          </div>

          <div className='flex flex-col gap-2'>
            <Switch size='sm'>notifications</Switch>
            <Switch size='sm'>recommendations</Switch>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ReaderTab;
