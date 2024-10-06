import AccountOutlet from '@/components/AccountOutlet';

const referralData = [
  {
    name: 'AZABBBB232',
    value: '$144,444',
    avatar: 'AZ',
  },
  {
    name: '@Z_BXXBB232',
    value: '$144,444',
    avatar: 'Z_',
  },
  {
    name: 'AZABBBB232',
    value: '$144,444',
    avatar: 'AZ',
  },
];

const ReferralPage = () => {
  return (
    <AccountOutlet>
      <div className="p-6">
        {/* User Information */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl">
            AK
          </div>
          <div className="ml-4 text-white text-left">
            <div className="text-lg font-bold">@AKZBDHEY__2</div>
            <div className="text-sm">124,544,29</div>
          </div>
        </div>
        {/* My Referrals Section */}
        <div className="text-white mb-4">
          <div className="flex justify-between items-center">
            <span className="font-bold">My referrals:</span>
            <span className="font-bold">10</span>
          </div>
        </div>
        {/* Invite Link Section */}
        <div className=" text-left bg-gray-800 rounded-lg p-4 flex justify-between items-center mb-6">
          <div className="text-white text-sm w-3/4 truncate">
            My Invite Links:
            <a
              href="https://www.google.com"
              className="block text-xs mt-1 text-gray-400">
              www.google.com/design/DAGRww4HHIw...
            </a>
          </div>
          <button className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg">
            COPY
          </button>
        </div>
        {/* Referral List */}
        <div className=" text-left text-white">
          <div className="font-bold mb-2">My referrals Lists:</div>
          {referralData.map((referral, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-800 rounded-lg p-4 mb-2">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl mr-4">
                {referral.avatar}
              </div>
              <div className="text-white">
                <div className="font-bold">{referral.name}</div>
                <div className="text-sm">{referral.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AccountOutlet>
  );
};

export default ReferralPage;
