import { BadgeCheckIcon } from '@heroicons/react/solid';
import formatHandle from '@lib/formatHandle';
import formatTime from '@lib/formatTime';
import getAvatar from '@lib/getAvatar';
import isVerified from '@lib/isVerified';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Profile } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

dayjs.extend(relativeTime);

interface Props {
  profile: Profile;
  message: DecodedMessage;
  conversationKey: string;
  isSelected: boolean;
}

const Preview: FC<Props> = ({ profile, message, conversationKey, isSelected }) => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const address = currentProfile?.ownedBy;

  const onConversationSelected = (profileId: string) => {
    router.push(profileId ? `/messages/${conversationKey}` : '/messages');
  };

  return (
    <div
      className={clsx(
        'py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800',
        isSelected && 'bg-gray-50 dark:bg-gray-800'
      )}
      onClick={() => onConversationSelected(profile.id)}
    >
      <div className="flex justify-between space-x-3 px-5">
        <img
          onError={({ currentTarget }) => {
            currentTarget.src = getAvatar(profile, false);
          }}
          src={getAvatar(profile)}
          loading="lazy"
          className="w-10 h-10 bg-gray-200 rounded-full border dark:border-gray-700"
          height={40}
          width={40}
          alt={formatHandle(profile?.handle)}
        />
        <div className="w-full">
          <div className="flex w-full justify-between space-x-1">
            <div className="flex gap-1 items-center max-w-sm">
              <div className="line-clamp-1 text-md">{profile?.name ?? formatHandle(profile.handle)}</div>
              {isVerified(profile?.id) && <BadgeCheckIcon className="min-w-fit w-4 h-4 text-brand" />}
            </div>
            {message.sent && (
              <span className="min-w-fit pt-0.5 text-xs lt-text-gray-500" title={formatTime(message.sent)}>
                {dayjs(new Date(message.sent)).fromNow()}
              </span>
            )}
          </div>
          <span className="text-sm lt-text-gray-500 line-clamp-1 break-all">
            {address === message.senderAddress && 'You: '} {message.content}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preview;
