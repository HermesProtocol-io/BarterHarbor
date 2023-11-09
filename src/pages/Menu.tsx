import Button from '../components/Button';

export const Menu = () => {

  
  return (
    <>
      <div className='my-20 relative grid grid-cols-2 justify-items-center'>
            <Button
            className="px-10"
                  onClick={() =>  window.location.href='/trade'}
                >New Trade 
            </Button>
            <Button onClick={() => {  }}>
                Review Offers 
            </Button>
      </div>
    </>
  );
};
