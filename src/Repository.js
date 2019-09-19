import React from 'react';

export default function Repository({ repository, onFetchMoreIssues }) {
    return (
        <div>
            <p>
                <strong>In repository:</strong>
                <a href={repository.url}>{repository.name}</a>
            </p>
            <ul>
                {repository.issues.edges.map(issue => {
                    return (
                    <li key={issue.node.id}>
                        <a href={issue.node.url}>{issue.node.title}</a>
        
                        <ul>
                            {issue.node.reactions.edges.map(reaction => {
                                return (
                                    <li key={reaction.node.id}>
                                        {reaction.node.content}
                                    </li>
                                )
                            })}  
                        </ul> 
                    </li>
                    )
                })}
            </ul>
    
            <hr />
            
            {repository.issues.pageInfo.hasNextPage && (
                <button onClick={onFetchMoreIssues}>More</button>
            )}
        </div>
    )
}