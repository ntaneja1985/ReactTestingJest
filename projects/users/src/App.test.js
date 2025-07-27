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