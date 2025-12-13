import MainContainer from '@/features/warehouse/components/MainContainer';
import React, { ReactNode } from 'react'

const WarehouseLayout = ({children, sidebar}: {children: ReactNode, sidebar: ReactNode}) => {
  return (
    <MainContainer sidebar={sidebar}>
        {children}
    </MainContainer>
  )
}

export default WarehouseLayout;