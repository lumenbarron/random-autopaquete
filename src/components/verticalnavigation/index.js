import React from 'react';
import { VerticalNavigation, VerticalSection, VerticalItem } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCog, faFolderOpen, faBook, faReceipt } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const StyledContainer = styled.div.attrs(props => {
    return props.theme.rainbow.palette;
})`
    width: 220px;
    background: ${props => props.background.main};
    border-bottom-left-radius: 0.875rem;
    border-right: 1px solid ${props => props.border.divider};
`;

class VerticalNavigationWithIcons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: 'item 5',
        };
        this.handleOnSelect = this.handleOnSelect.bind(this);
    }

    handleOnSelect(e, selectedItem) {
        return this.setState({ selectedItem });
    }

    render() {
        return (
            <VerticalNavigation
                selectedItem={this.state.selectedItem}
                onSelect={this.handleOnSelect}
            >
                <VerticalSection>
                    <VerticalItem
                        name="item-1"
                        label="Folders"
                        icon={<FontAwesomeIcon icon={faFolderOpen} />}
                    />
                    <VerticalItem
                        name="item-2"
                        label="Recents"
                        icon={<FontAwesomeIcon icon={faClock} />}
                    />
                    <VerticalItem
                        name="item-3"
                        label="Settings"
                        icon={<FontAwesomeIcon icon={faCog} />}
                    />
                    <VerticalItem
                        name="item-4"
                        label="Projects"
                        icon={<FontAwesomeIcon icon={faBook} />}
                    />
                    <VerticalItem
                        name="item-5"
                        label="Reports"
                        icon={<FontAwesomeIcon icon={faReceipt} />}
                    />
                </VerticalSection>
            </VerticalNavigation>
        );
    }
}

<div>
    <GlobalHeader />
    <StyledContainer className="rainbow-p-top_small rainbow-p-bottom_large">
        <VerticalNavigationWithIcons />
    </StyledContainer>
</div>;
