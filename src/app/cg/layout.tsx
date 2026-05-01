import CGNavbar from '@/components/cg/CGNavbar';
import PageWrapper from '@/components/cg/PageWrapper';

export default function CGLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CGNavbar />
      <PageWrapper>{children}</PageWrapper>
    </>
  );
}
