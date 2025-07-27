import {render,screen} from '@testing-library/react';
import user from '@testing-library/user-event'
import UserForm from './UserForm';

test('it shows 2 inputs and a button', () => {
    //Render the component
    render(<UserForm />);

    //Manipulate the component or find an element inside of it
    const inputs = screen.getAllByRole('textbox');
    const button = screen.getByRole('button');

    //Assertion-make sure the component is doing what is expected
    expect(inputs.length).toBe(2);
    expect(button).toBeInTheDocument();

})

test('it calls onUserAdd when the form is submitted', async () => {
    //NOT THE BEST IMPLEMENTATION
    // const argList=[];
    // const callback = (...args) =>{
    //     argList.push(args);
    // }

    //BETTER IMPLEMENTATION
    const mock = jest.fn();


    //Render the component
    render(<UserForm onUserAdd={mock} />);

    //Find the 2 inputs
    //const [nameInput,emailInput] = screen.getAllByRole('textbox');
    const nameInput = screen.getByRole("textbox",{
        name: /name/i
    })
    const emailInput = screen.getByRole("textbox",{
        name: /email/i
    })

    //Simulate typing in a name and email
    user.click(nameInput);
    user.keyboard('jane');

    user.click(emailInput);
    user.keyboard('jane@jane.com');

    //Find the button
    const button = screen.getByRole('button');

    //Simulate clicking the button
    user.click(button);

    //Assertion to make sure 'onUserAdd' gets called with name and email
    //expect(callback).toBeCalledWith({name,emailInput});
    //expect(argList).toHaveLength(1);
    //expect(argList[0][0]).toEqual({name:'jane',email:'jane@jane.com'});

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith({name:'jane',email:'jane@jane.com'})
})

test('empties the two inputs when the form is submitted',async ()=>{
    render(<UserForm onUserAdd={()=>{}} />);

    const nameInput = screen.getByRole("textbox",{name: /name/i})
    const emailInput = screen.getByRole("textbox",{name: /email/i})
    const button = screen.getByRole('button');

    await user.click(nameInput);
    await user.keyboard('jane');
    await user.click(emailInput);
    await user.keyboard('jane@jane.com');
    await user.click(button);

    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('')

})