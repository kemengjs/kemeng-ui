import {
	AppBar,
	Backdrop,
	Button,
	Container,
	Divider,
	Drawer,
	DrawerProps,
	Fade,
	Input,
	Link,
	List,
	Menu,
	MenuItem,
	MenuList,
	Modal,
	Select,
	Paper,
	Popover,
	PopoverProps,
	ThemePrivder,
	Typography,
	FormControl,
	InputLabel
} from '@kemengjs/kemeng-ui'
import { css } from '@linaria/atomic'
import { Fragment, useState } from 'react'

function VirtualElementPopover() {
	const [open, setOpen] = useState(false)
	const [anchorEl, setAnchorEl] = useState<PopoverProps['anchorEl']>(null)

	const handleClose = () => {
		setOpen(false)
	}

	const handleMouseUp = () => {
		const selection = window.getSelection()

		// Skip if selection has a length of 0
		if (!selection || selection.anchorOffset === selection.focusOffset) {
			return
		}

		const getBoundingClientRect = () => {
			return selection.getRangeAt(0).getBoundingClientRect()
		}

		setOpen(true)

		setAnchorEl({ getBoundingClientRect, nodeType: 1 })
	}

	const id = open ? 'virtual-element-popover' : undefined

	return (
		<div>
			<Typography aria-describedby={id} onMouseUp={handleMouseUp}>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ipsum
				purus, bibendum sit amet vulputate eget, porta semper ligula. Donec
				bibendum vulputate erat, ac fringilla mi finibus nec. Donec ac dolor sed
				dolor porttitor blandit vel vel purus. Fusce vel malesuada ligula. Nam
				quis vehicula ante, eu finibus est. Proin ullamcorper fermentum orci,
				quis finibus massa. Nunc lobortis, massa ut rutrum ultrices, metus metus
				finibus ex, sit amet facilisis neque enim sed neque. Quisque accumsan
				metus vel maximus consequat. Suspendisse lacinia tellus a libero
				volutpat maximus.
			</Typography>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				onClose={handleClose}
				disableAutoFocus
			>
				<Paper>
					<Typography
						className={css`
							padding: 16px;
						`}
					>
						The content of the Popover.
					</Typography>
				</Paper>
			</Popover>
		</div>
	)
}

function TemporaryDrawer() {
	const [open, setOpen] = useState(false)

	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen)
	}

	return (
		<div>
			<Button onClick={toggleDrawer(true)}>Open drawer</Button>
			<Drawer open={open} onClose={toggleDrawer(false)}>
				<div
					className={css`
						background-color: #fff;
						border: 2px solid #000;
					`}
				>
					<h2 id='child-modal-title'>Text in a child modal</h2>
					<p id='child-modal-description'>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit.
					</p>
				</div>
			</Drawer>
		</div>
	)
}

function AnchorTemporaryDrawer() {
	const [state, setState] = useState({
		top: false,
		left: false,
		bottom: false,
		right: false
	})

	const toggleDrawer =
		(anchor: DrawerProps['anchor'], open: boolean) =>
		(event: React.KeyboardEvent | React.MouseEvent) => {
			if (
				event.type === 'keydown' &&
				((event as React.KeyboardEvent).key === 'Tab' ||
					(event as React.KeyboardEvent).key === 'Shift')
			) {
				return
			}

			setState({ ...state, [anchor]: open })
		}

	const list = () => (
		<div
			className={css`
				background-color: #fff;
				border: 2px solid #000;
			`}
		>
			<h2 id='child-modal-title'>Text in a child modal</h2>
			<p id='child-modal-description'>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit.
			</p>
		</div>
	)

	return (
		<div>
			{(['left', 'right', 'top', 'bottom'] as const).map(anchor => (
				<Fragment key={anchor}>
					<Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
					<Drawer
						anchor={anchor}
						open={state[anchor]}
						onClose={toggleDrawer(anchor, false)}
					>
						{list()}
					</Drawer>
				</Fragment>
			))}
		</div>
	)
}

function BasicMenu() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<div>
			<Button
				style={{
					marginLeft: '20px'
				}}
				id='basic-button'
				onClick={handleClick}
			>
				Dashboard
			</Button>
			<Menu
				id='basic-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button'
				}}
				PaperProps={{
					style: {
						maxHeight: '100px'
					}
				}}
				TransitionComponent={Fade}
			>
				<MenuItem disabled onClick={handleClose}>
					Profile
				</MenuItem>
				<MenuItem onClick={handleClose}>My account</MenuItem>
				<MenuItem onClick={handleClose}>Logout</MenuItem>
			</Menu>
		</div>
	)
}

const options = [
	'Show some love to MUI',
	'Show all notification content',
	'Hide sensitive notification content',
	'Hide all notification content'
]

function SimpleListMenu() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [selectedIndex, setSelectedIndex] = useState(1)
	const open = Boolean(anchorEl)
	const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleMenuItemClick = (
		event: React.MouseEvent<HTMLElement>,
		index: number
	) => {
		setSelectedIndex(index)
		setAnchorEl(null)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<div>
			<Button
				style={{
					marginLeft: '20px'
				}}
				id='basic-button'
				onClick={handleClickListItem}
			>
				Dashboard
			</Button>
			<Menu
				id='lock-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'lock-button',
					role: 'listbox'
				}}
			>
				{options.map((option, index) => (
					<MenuItem
						key={option}
						disabled={index === 0}
						selected={index === selectedIndex}
						onClick={event => handleMenuItemClick(event, index)}
					>
						{option}
					</MenuItem>
				))}
			</Menu>
		</div>
	)
}

function BasicSelect() {
	const [age, setAge] = useState('')

	const handleChange = event => {
		setAge(event.target.value as string)
	}

	return (
		<div
			className={css`
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 1000px;
			`}
		>
			<div
				className={css`
					min-width: 120px;
				`}
			>
				<FormControl fullWidth>
					<InputLabel id='demo-simple-select-label'>Age</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={age}
						label='Age'
						onChange={handleChange}
					>
						<MenuItem value={10}>Ten</MenuItem>
						<MenuItem value={20}>Twenty</MenuItem>
						<MenuItem value={30}>Thirty</MenuItem>
					</Select>
				</FormControl>
			</div>
		</div>
	)
}

export default function App() {
	const [open, setOpen] = useState(false)
	const handleClose = () => {
		setOpen(false)
	}
	const handleOpen = () => {
		setOpen(true)
	}

	function ChildModal() {
		const [open, setOpen] = useState(false)
		const handleOpen = () => {
			setOpen(true)
		}
		const handleClose = () => {
			setOpen(false)
		}

		return (
			<>
				<Button onClick={handleOpen}>Open Child Modal</Button>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby='child-modal-title'
					aria-describedby='child-modal-description'
				>
					<div
						className={css`
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							width: 200px;
							background-color: #fff;
							border: 2px solid #000;
							padding: 32px;
						`}
					>
						<h2 id='child-modal-title'>Text in a child modal</h2>
						<p id='child-modal-description'>
							Lorem ipsum, dolor sit amet consectetur adipisicing elit.
						</p>
						<Button onClick={handleClose}>Close Child Modal</Button>
					</div>
				</Modal>
			</>
		)
	}

	function BasicPopover() {
		const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

		const handleClick = event => {
			setAnchorEl(event.currentTarget)
		}

		const handleClose = () => {
			setAnchorEl(null)
		}

		const open = Boolean(anchorEl)
		const id = open ? 'simple-popover' : undefined

		return (
			<div>
				<Button style={{ marginLeft: '200px' }} onClick={handleClick}>
					Open Popover
				</Button>
				<Popover
					id={id}
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left'
					}}
				>
					<Typography
						className={css`
							padding: 16px;
						`}
					>
						The content of the Popover.
					</Typography>
				</Popover>
			</div>
		)
	}

	return (
		<ThemePrivder>
			<Button
				style={{
					marginTop: '40px'
				}}
				fullWidth
				size='large'
				onClick={handleOpen}
			>
				难崩
			</Button>
			<Typography variant='body1'>123123</Typography>
			<Link>test</Link>
			<Container>ddd</Container>
			<AppBar>gooods</AppBar>
			<Paper
				square
				className={css`
					&.kemengui-paperElevation {
						box-shadow: none;
					}
				`}
				style={{
					color: 'yellow'
				}}
			>
				123123
			</Paper>
			<MenuItem>tititi</MenuItem>
			<List className='zssss'>123123</List>

			<Paper>
				<MenuList>
					<MenuItem disabled>Profile</MenuItem>
					<MenuItem>My account</MenuItem>
					<MenuItem>Logout</MenuItem>
				</MenuList>
			</Paper>

			{/* <Backdrop open={open} onClick={handleClose}>
				aa
			</Backdrop> */}

			<Modal open={open} onClose={handleClose}>
				<Fade in={open}>
					<div
						className={css`
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							width: 400px;
							background-color: #fff;
							border: 2px solid #000;
							padding: 32px;
						`}
					>
						<Typography id='modal-modal-title' variant='h6'>
							Text in a modal
						</Typography>
						<Typography id='modal-modal-description'>
							Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
						</Typography>
						<Button onClick={handleClose}>Close Child Modal</Button>
						<ChildModal />
					</div>
				</Fade>
			</Modal>

			<BasicPopover />
			<VirtualElementPopover />
			<TemporaryDrawer />
			<AnchorTemporaryDrawer />
			<BasicMenu />
			<SimpleListMenu />
			<Divider variant='middle' />
			<label data-shrink={false}>123</label>
			<div>
				<Input />
			</div>
			<BasicSelect />
		</ThemePrivder>
	)
}
