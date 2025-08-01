import {screen, render } from '@testing-library/react';
import RepositoriesSummary from './RepositoriesSummary';

test('displays the primary language of the repository',()=>{
    const repository = {
        language: 'javascript',
        stargazers_count: 1,
        forks: 30,
        open_issues: 20,
    }
    render(<RepositoriesSummary repository={repository} />);

    const language = screen.getByText('javascript');
    expect(language).toBeInTheDocument();
})

test('displays the information about the repository',()=>{
    const repository = {
        language: 'javascript',
        stargazers_count: 7,
        forks: 30,
        open_issues: 20,
    }
    render(<RepositoriesSummary repository={repository} />);

    // const language = screen.getByText('javascript');
    // const stars = screen.getByText(7);
    //
    // expect(language).toBeInTheDocument();
    // expect(stars).toBeInTheDocument();

    for(let key in repository) {
        const value = repository[key];

        const element = screen.getByText(new RegExp(value));
        expect(element).toBeInTheDocument();
    }
})