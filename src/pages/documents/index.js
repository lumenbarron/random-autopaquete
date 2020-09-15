import React, { useState } from 'react';
import { Tab } from 'react-rainbow-components';
import { StyledContainer, StyledTabset } from './styled';
import { useRegularSecurity } from '../../hooks/useRegularSecurity';
import TabPersonaFisica from './persona-fisica';
import TabPersonaMoral from './persona-moral';

const DocumentsPage = () => {
    const [selectedTab, setSelectedTab] = useState('pfisica');

    //useRegularSecurity();

    return (
        <StyledContainer>
            <StyledTabset
                id="tabset-1"
                className="rainbow-p-horizontal_x-large"
                activeTabName={selectedTab}
                onSelect={(e, selected) => {
                    setSelectedTab(selected);
                }}
            >
                <Tab
                    label="Persona Física"
                    name="pfisica"
                    id="pfisica"
                    ariaControls="pfisicaTab"
                    className="tabsets"
                />
                {/* <Tab
                    label="Persona Moral"
                    name="pmoral"
                    id="pmoral"
                    ariaControls="pmoralTab"
                    className="tabsets"
                /> */}
            </StyledTabset>

            {selectedTab === 'pfisica' && <TabPersonaFisica />}
            {selectedTab === 'pmoral' && <TabPersonaMoral />}
        </StyledContainer>
    );
};

export default DocumentsPage;
