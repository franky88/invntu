'user client'

import React from 'react'

interface Props {
    name: string
}

const LinkDefault = ({name}: Props) => {
    const handleClick = () => {
        console.log('working!')
    }
  return (
    <button onClick={handleClick} className='link link-hover'>{name}</button>
  )
}

export default LinkDefault