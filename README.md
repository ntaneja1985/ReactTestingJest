# Testing React using React Testing Library and Jest

- ![img.png](img.png)
- Sample test
```jsx
import { render, screen, waitFor } from '@testing-library/react';

import user from '@testing-library/user-event';
import App from './App';

test('shows 6 products by default', async () => {
  render(<App />);

  const titles = await screen.findAllByRole('heading');
  expect(titles).toHaveLength(6);
});

test('clicking on the button loads 6 more products', async () => {
  render(<App />);

  const button = await screen.findByRole('button', {
    name: /load more/i,
  });

  user.click(button);

  await waitFor(async () => {
    const titles = await screen.findAllByRole('heading');
    expect(titles).toHaveLength(12);
  });
});

//});

```
- We can run these tests by running the following command:
```shell
yarn test 
```
- ![img_1.png](img_1.png)
- ![img_2.png](img_2.png)
- ![img_4.png](img_4.png)

### Understanding how testing code works
- ![img_5.png](img_5.png)
- ![img_6.png](img_6.png)
- ![img_7.png](img_7.png)

## Overview of the Testing Process
- ![img_8.png](img_8.png)
- ![img_9.png](img_9.png)

### Creating a new React Project
- ![img_11.png](img_11.png)
- Creating the UserForm component
```jsx
import React, {useState} from 'react'


function UserForm() {
    const [email,setEmail] = useState('');
    const [name,setName] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name,email);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button>Add User</button>
        </form>
    )
}

export default UserForm

```
- We can write our UserList component as follows:
```jsx
import React from 'react'

function UserList({users}) {
    const renderedUsers = users.map((user) => {
        return (
            <tr key={user.name}>
                <td>{user.name}</td>
                <td>{user.email}</td>
            </tr>
        )
    })

    return (
    <>
        {users && users.length > 0 ?
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody>
                {renderedUsers}
                </tbody>
            </table>  : <p>No users found!</p>}

    </>
)
}

export default UserList

```
- Code for App.js will be as follows:
```jsx
import UserForm from "./UserForm";
import {useState} from "react";
import UserList from "./UserList";


function App() {
  const [users,setUsers] = useState([]);
  const onUserAdd = (user) => {
    setUsers([...users, user]);
  }

  return <div>
  <UserForm onUserAdd={onUserAdd}/>
    <hr/>
    <UserList users = {users}/>
  </div>
}

export default App;

```
## Writing the first test for the above code
- ![img_12.png](img_12.png)
- ![img_13.png](img_13.png)
- ![img_14.png](img_14.png)
- We can write our first UserForm.test.js as follows:
```jsx
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
```
- When we run our tests, they are executed in NodeJS environment
- jsDom creates a fake browser environment whenever we call render() method
- ![img_15.png](img_15.png)
- We can then access elements using screen object
- We can use query methods like getAllByRole() and getByRole() to access the elements
- ![img_16.png](img_16.png)
- ![img_17.png](img_17.png)

### Understanding ARIA roles
- Note that we have code like this:
```jsx
 //Manipulate the component or find an element inside of it
    const inputs = screen.getAllByRole('textbox');
    const button = screen.getByRole('button');
```
- These roles are called ARIA roles
- ARIA roles clarify the purpose of an HTML element
- They were traditionally used by screen-readers-softwares that help people understand content on the screen
- Many HTML elements have an "implicit" or automatically assigned role.
- Elements can be assigned manually a role also. 
- ![img_18.png](img_18.png)

### Understanding JEST matchers
- We have the following code:
```jsx
//Assertion-make sure the component is doing what is expected
    expect(inputs.length).toBe(2);
    expect(button).toBeInTheDocument();
```
- expect is provided by JEST testing framework
- It has JEST matchers like toHaveLength() or toBeInDocument()
- ![img_19.png](img_19.png)
- ![img_20.png](img_20.png)
- ![img_21.png](img_21.png)


### Simulating User Events
- ![img_22.png](img_22.png)
- One not so good implementation is as follows:
```jsx
test('it calls onUserAdd when the form is submitted', async () => {
    //NOT THE BEST IMPLEMENTATION
    const argList=[];
    const callback = (...args) =>{
        argList.push(args);
    }
    //Render the component
    render(<UserForm onUserAdd={callback} />);

    //Find the 2 inputs
    const [nameInput,emailInput] = screen.getAllByRole('textbox');

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
    expect(argList).toHaveLength(1);
    expect(argList[0][0]).toEqual({name:'jane',email:'jane@jane.com'});

})
```

### Introducing Mock Functions
- ![img_23.png](img_23.png)
- ![img_24.png](img_24.png)
- ![img_25.png](img_25.png)
- Jest has a mock function: jest.fn()
```jsx
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
    const [nameInput,emailInput] = screen.getAllByRole('textbox');

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
```
### Querying Elements by Labels
- ![img_26.png](img_26.png)
- ![img_27.png](img_27.png)
- We can reorder inputs, add more inputs without breaking the test
```jsx
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
```

### Testing the UserList
- ![img_28.png](img_28.png)
- ![img_29.png](img_29.png)
- We will use the testing playground to help us write query functions
- For this we need to add this code to our test
```jsx
screen.logTestingPlaygroundURL();
```
- ![img_30.png](img_30.png)
- ![img_31.png](img_31.png)
- ![img_32.png](img_32.png)
- Please note if we use the query function, we will find all the rows including the rows in the header which we dont want
```jsx
    //Find all the rows in the table
    screen.logTestingPlaygroundURL();
    const rows = screen.getAllByRole('row');
```
- ![img_33.png](img_33.png)
- We will go with Fallback #1
- Add a data-testid to the UserList.js component
```jsx
import React from 'react'

function UserList({users}) {
    const renderedUsers = users.map((user) => {
        return (
            <tr key={user.name}>
                <td>{user.name}</td>
                <td>{user.email}</td>
            </tr>
        )
    })

    return (
    <>
        {users && users.length > 0 ?
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody data-testid="users">
                {renderedUsers}
                </tbody>
            </table>  : <p>No users found!</p>}

    </>
)
}

export default UserList

```
- Now we can modify our test as follows:
```jsx
test('render one row per user', ()=>{
//Render the component
    const users = [
        {
            name:'jane',
            email:'jane@example.com',
        },
        {
            name:'sam',
            email: 'sam@sam.com',
        }
    ]
    //Render the component
    render(<UserList users={users} />);

    //Find all the rows in the table
    //screen.logTestingPlaygroundURL();
    //const rows = screen.getAllByRole('row');
    const rows = within(screen.getByTestId('users')).getAllByRole('row');

    //Assertion: correct number of rows in the table
    expect(rows).toHaveLength(2);
});
```
- However, for testing purposes, we are modifying our component, this is not the best idea

### Another Query Function Fallback
- We can also use the container approach and get the elements directly
```jsx
test('render one row per user', ()=>{
//Render the component
    const users = [
        {
            name:'jane',
            email:'jane@example.com',
        },
        {
            name:'sam',
            email: 'sam@sam.com',
        }
    ]
    //Render the component
    //Automatically added HTML property when we render the component
    const {container} =  render(<UserList users={users} />);

    //Find all the rows in the table
    //screen.logTestingPlaygroundURL();
    //const rows = screen.getAllByRole('row');
    //const rows = within(screen.getByTestId('users')).getAllByRole('row');
    const table = container.querySelector('table');
    const rows = container.querySelectorAll('tbody tr');


    //Assertion: correct number of rows in the table
    expect(rows).toHaveLength(2);
});
```
### Testing the contents of a Table
```jsx
test('render the email and name for each user', ()=>{
    //Render the component
    const users = [
        {
            name:'jane',
            email:'jane@example.com',
        },
        {
            name:'sam',
            email: 'sam@sam.com',
        }
    ]
    //Render the component
    render(<UserList users={users} />);

    screen.logTestingPlaygroundURL();

    for(let user of users){
        const name  = screen.getByRole('cell', { name: user.name });
        const email = screen.getByRole('cell', { name: user.email });
        expect(name).toBeInTheDocument();
        expect(email).toBeInTheDocument();
    }
})
```
### Avoiding duplication in the test file
- To do some initial setup, before running the tests we can use the beforeEach(()=>{}) function
- This function will run some code before executing the tests in the test file
- So we can put some common logic in there
- There is an alternative approach also, we can use a common function and call that function inside our components like this

```jsx
import {render,screen, within} from '@testing-library/react';
import UserList from './UserList';

function renderComponent(){
    const users = [
        {
            name:'jane',
            email:'jane@example.com',
        },
        {
            name:'sam',
            email: 'sam@sam.com',
        }
    ]

    render(<UserList users={users} />)

    return {
        users,
    }
}

test('render one row per user', ()=>{
//Render the component
    renderComponent();

    //Find all the rows in the table
    //screen.logTestingPlaygroundURL();
    //const rows = screen.getAllByRole('row');
    const rows = within(screen.getByTestId('users')).getAllByRole('row');
    //const table = container.querySelector('table');
    //const rows = container.querySelectorAll('tbody tr');


    //Assertion: correct number of rows in the table
    expect(rows).toHaveLength(2);
});

test('render the email and name for each user', ()=>{
    //Render the component
    const {users} = renderComponent();

    screen.logTestingPlaygroundURL();

    for(let user of users){
        const name  = screen.getByRole('cell', { name: user.name });
        const email = screen.getByRole('cell', { name: user.email });
        expect(name).toBeInTheDocument();
        expect(email).toBeInTheDocument();
    }
})
```
### Testing the App Component
- To get an idea of what the component is rendering on screen, after performing various actions, we can use the following code:
```jsx
screen.debug()
```
- We can test the whole App.test.js as follows:
```jsx
import { render, screen } from '@testing-library/react';
import App from './App';
import user from '@testing-library/user-event'


test('renders without crashing', () => {
  render(<App />);
});

test('can receive a new user and show it on a list',()=>{
  render(<App />);
  const nameInput = screen.getByRole("textbox",{
    name: /name/i
  });

  const emailInput = screen.getByRole("textbox",{
    name: /email/i
  });

  const button = screen.getByRole('button');

  user.click(nameInput);
  user.keyboard('jane');
  user.click(emailInput);
  user.keyboard('jane@jane.com');

  user.click(button);

  //Getting feedback for how the component is rendering
  //screen.debug();

  const name = screen.getByRole('cell', { name: /^jane$/i });  // Exact match with regex
  const email = screen.getByRole('cell', { name: /jane@jane\.com/i });  // Email-specific pattern

  expect(name).toBeInTheDocument();
  expect(email).toBeInTheDocument();

})
```
### Using Test Driven Development(TDD)
- Make a test which fails.
- We basically need to reset the form inputs when the form is submitted
- This test will fail initially
```jsx
test('empties the two inputs when the form is submitted',()=>{
    render(<UserForm onUserAdd={()=>{}} />);

    const nameInput = screen.getByRole("textbox",{name: /name/i})
    const emailInput = screen.getByRole("textbox",{name: /email/i})
    const button = screen.getByRole('button');

    user.click(nameInput);
    user.keyboard('jane');
    user.click(emailInput);
    user.keyboard('jane@jane.com');
    user.click(button);

    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('')

})
```
- Now we will make code changes in our component in the handleSubmit() function
```jsx
function UserForm({onUserAdd}) {
    const [email,setEmail] = useState('');
    const [name,setName] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(name,email);
        onUserAdd({name,email})
        setEmail('');
        setName('');
    }
```

- Now our test starts passing

## Understanding Element Roles

### RTL Book
- ![img_34.png](img_34.png)
- ![img_35.png](img_35.png)

### Partial Role List(Finding by Role Name)
- Consider we have the following component:
```jsx
import {render,screen} from '@testing-library/react';

function RoleExample(){
  return (
    <div>
    <a href = "/">Link</a>
    <button>Button</button>
    <footer>Content Info</footer>
    <h1>Heading</h1>
    <header>Banner</header>
    <img alt="description" /> Img
    <input type="checkbox"/> checkbox
    <input type="number" /> Spinbutton
    <input type="radio" /> radio
    <input type = "text" /> Textbox
    <li>List Item</li>
    <ul>Listgroup</ul>
    </div>
  )
}

render(<RoleExample/>)
```

- Now if we have to write a test to select each of the element we can do it like this
```jsx
test('can find elements by role',()=>{
  render(<RoleExample/>)
  const roles = [
    'link',
    'button',
    'contentinfo',
    'heading',
    'banner',
    'img',
    'checkbox',
    'spinbutton',
    'radio',
    'textbox',
    'listitem',
    'list'
  ];

  for(let role of roles)
  {
    const el = screen.getByRole(role);
    expect(el).toBeInTheDocument();
  }
})
```

### Finding by Accessible Names
- The accessible name of an element is the text inside of it
- However, input element doesnot have a text inside of it
- It can be useful for buttons
- We have the following component:
```jsx
function AccessibleName(){
  return (
    <div>
    <button>Submit</button>
    <button>Cancel</button>
    </div>
  )
}

render(<AccessibleName/>)
```
- Its test cases can be as follows:
```jsx
test('can select by accessible name',()=>{
  render(<AccessibleName/>)
  const submitBtn = screen.getByRole('button',{
    name: /Submit/i
  })
  const cancelBtn = screen.getByRole('button',{
    name: /Cancel/i
  })
expect(submitBtn).toBeInTheDocument()
expect(cancelBtn).toBeInTheDocument()
})
```

### Linking Inputs to Labels
- Suppose we have a component like this
```jsx
function MoreNames(){
  return (
    <div>
    <label htmlFor="email">Email</label>
    <input id="email" />

    <label htmlFor="search">Search</label>
    <input id="search"/>
    </div>
  )
}
```
- Now we can test it as follows:
```jsx
test('make sure 2 inputs rendered',()=>{
  render(<MoreNames/>);
  const emailInput = screen.getByRole('textbox',{
    name:/email/i
  });

  const searchInput = screen.getByRole('textbox',{
    name:/search/i
  });

  expect(emailInput).toBeInTheDocument();
  expect(searchInput).toBeInTheDocument();

})
```
### Directly Assigning an Accessible Name
- If we don't want to assign a name to the element, we can make use of aria-labels
- Consider the following JSX:
```jsx
function IconButtons(){
  return (
    <div>
    <button aria-label="sign in">
    <svg />
    </button>

    <button aria-label="sign out">
    <svg />
    </button>
    </div>
  )
}

render(<IconButtons/>)
```
- We can test it as follows:
```jsx
test('find elements based on label',()=>{

  render(<IconButtons/>)
  const signInButton = screen.getByRole('button',{
    name: /sign in/i
  });

  const signOutButton = screen.getByRole('button',{
    name: /sign out/i
  });

expect(signInButton).toBeInTheDocument();
  expect(signOutButton).toBeInTheDocument();


})
```

## Finding elements by Query Functions
- ![img_36.png](img_36.png)
- ![img_37.png](img_37.png)
- So they are getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy
- ![img_38.png](img_38.png)
- ![img_39.png](img_39.png)
- ![img_40.png](img_40.png)
- Lets say we have this component:
```jsx


function ColorList(){
  return (
    <ul> 
    <li>Red</li>
    <li>Blue</li>
    <li>Green</li>
    </ul>
  );
}

render(<ColorList/>);
```
- We can test it by using query functions as follows:
```jsx
test('getBy, queryBy, findBy finding 0 elements',async ()=>{

  render(<ColorList/>)
  //getByRole, getByText
  //screen.getByRole('textbox') //shows error


  //queryByRole, queryByText
  screen.queryByRole('textbox') //returns null

  //findByRole
  //Works asynchronously
  //Watch the output of the component over a span of one second by default and many times within that second by default(every 50 milliseconds)
  //Will try to find that element else will throw an error
  //Technically it returns a promise that gets rejected
  
  let errorThrown = false;
  try {
  await screen.findByRole('textbox') //shows error after 1 second
  }
  catch(err){
    errorThrown = true;
  }

  expect(errorThrown).toEqual(true)
  


  //This is a matcher
  expect(
    ()=> screen.getByRole('textbox')
    ).toThrow();

     expect(
    screen.queryByRole('textbox')
    ).toEqual(null);

    

})
```

- What if these query functions find exactly one element
```jsx
test('getBy, queryBy, findBy when they find 1 element',async ()=>{
render(<ColorList/>)

expect(screen.getByRole('list')).toBeInTheDocument();

expect(screen.queryByRole('list')).toBeInTheDocument();

expect(await screen.findByRole('list')).toBeInTheDocument();

})
```
- What if these query functions find more than one element
```jsx
test('getBy, queryBy, findBy when they find greater than 1 element',async ()=>{
render(<ColorList/>)

 expect(()=>
screen.getByRole('listitem') 
 ).toThrow();
   
 expect(
()=> screen.queryByRole('listitem') 
 ).toThrow();
  
  
  let errorThrown = false;
  try {
  await screen.findByRole('listitem') //shows error after 1 second
  }
  catch(err){
    errorThrown = true;
  }

  expect(errorThrown).toEqual(true)
})
```

### Multiple Element Variations
- Lets try with getAllBy, queryAllBy and findAllBy variations
```jsx
test('getAllBy, queryAllBy, findAllBy', async ()=>{

render(<ColorList/>)

expect(screen.getAllByRole('listitem')
).toHaveLength(3)

expect(screen.queryAllByRole('listitem')
).toHaveLength(3)

expect(await screen.findAllByRole('listitem')
).toHaveLength(3)

})

```










