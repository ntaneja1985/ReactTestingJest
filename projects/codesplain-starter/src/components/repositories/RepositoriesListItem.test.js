import {render,screen, act} from '@testing-library/react';
import RepositoriesListItem from './RepositoriesListItem';
import {MemoryRouter} from 'react-router-dom';


// jest.mock('../tree/FileIcon',()=>{
//     //Content of FileIcon.js
//     return ()=>{
//         return 'File Icon component';
//     }
// })

function renderComponent(){
    const repository = {
        language: 'javascript',
        full_name: 'facebook/react',
        owner: {
            login:'facebook'
        },
        name:'react',
        description:'A JS library',
        html_url: 'https://github.com/facebook/react',
    }
    render(
        <MemoryRouter>
        <RepositoriesListItem repository={repository}/>
        </MemoryRouter>
        );

    return {repository};
}

test('shows a link to the github homepage for this repository',async ()=>{
   const {repository} = renderComponent();

   await screen.findByRole('img',{name:'javascript'});
   const link =  screen.getByRole('link',{
       name: /github repository/i
   });
   expect(link).toHaveAttribute('href',repository.html_url)
})

test('shows a file icon with the appropriate icon',async ()=>{
    renderComponent();

    const icon = await screen.findByRole('img',{name:'javascript'});
    expect(icon).toHaveClass('js-icon')
})

test('shows a link to the code editor page',async ()=>{
    const {repository} = renderComponent();

     const link  = await screen.findByRole('link',{name: new RegExp(repository.owner.login)});
     expect(link).toHaveAttribute('href',`/repositories/${repository.full_name}`);
})

//Add a small pause inside the test
const pause = () =>{
    return new Promise(resolve => setTimeout(resolve, 100));
}
