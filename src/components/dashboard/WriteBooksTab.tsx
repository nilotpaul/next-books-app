import { Chip } from '@nextui-org/chip';

const WriteBooksTab = () => {
  return (
    <div className='space-y-8'>
      <section>
        <Chip variant='dot' color='warning'>
          Draft
        </Chip>
      </section>

      <section>
        <Chip variant='dot' color='success'>
          Published
        </Chip>
      </section>
    </div>
  );
};

export default WriteBooksTab;
