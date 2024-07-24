'use client'

interface BtnProps {
    name: string;
    btnOnClick: () => void;
}

const BtnDefault = ({name, btnOnClick}: BtnProps) => {
  return (
    <button className="btn btn-primary btn-sm" onClick={btnOnClick}>{name ?? 'Button'}</button>
  )
}

export default BtnDefault